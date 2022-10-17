import * as Sentry from '@sentry/browser';
import QueryString from 'query-string';
import caseConverter from './caseConverter';

interface CaseConverter {
  camelCaseToSnakeCase: (data: any, ignoredKeys?: string[]) => any
  snakeCaseToCamelCase: (data: any, ignoredKeys?: string[]) => any
}

interface Auth {
  getToken: () => string | null
}

type LogFunction = (message?: any, ...optionalParams: any[]) => void

type AddBreadCrumbFunction = (method: string, endpoint: string, params?: any, headers?: Record<string, any>, response?: any) => void

const addBreadCrumb: AddBreadCrumbFunction = (method, endpoint, params, headers = {}, response?: any): void => {
  Sentry.addBreadcrumb({
    data: {
      endpoint,
      method,
      response: JSON.stringify(response),
      params: JSON.stringify(params),
      headers: JSON.stringify(headers),
    },
    category: 'Network',
    //@ts-ignore
    level: 'info',
  });
};

const defaultCaseConverter: CaseConverter = {
  camelCaseToSnakeCase: (data: any): any => data,
  snakeCaseToCamelCase: (data: any): any => data,
};

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip, deflate',
};

interface ServerErrorResponse {
  errorCode: number
  errorMessage: string
  errorData: any
}

class ServerAPIError extends Error {
  name = 'ServerAPIError'

  data: ServerErrorResponse

  stack: string | undefined

  constructor(json: ServerErrorResponse) {
    super();
    this.data = json;
    this.stack = (new Error()).stack;
  }
}

export default class RequestUtil {
  auth?: Auth

  apiUrl: string

  caseConverter: CaseConverter

  log: LogFunction | null

  defaultHeaders: Record<string, string>

  tokenType: string

  addBreadCrumb: AddBreadCrumbFunction | null

  constructor(options: {
    auth?: Auth,
    apiUrl: string,
    shouldConvertCase?: boolean
    caseConverter?: CaseConverter
    log?: LogFunction,
    defaultHeaders?: Record<string, string>
    tokenType?: string,
    shouldAddBreadCrumb?: boolean
  }) {
    const {
      auth,
      apiUrl,
      shouldConvertCase = true,
      log,
      defaultHeaders: headers = {},
      tokenType,
      shouldAddBreadCrumb,
    } = options;

    this.auth = auth;
    this.apiUrl = apiUrl;
    this.caseConverter = shouldConvertCase ? caseConverter : defaultCaseConverter;
    this.log = log || null;
    this.defaultHeaders = { ...defaultHeaders, ...headers };
    this.tokenType = tokenType || 'Bearer';
    this.addBreadCrumb = shouldAddBreadCrumb ? addBreadCrumb : null;
  }

  // data.A.data.B.data.C => A.B.C
  removeDataProperty = (obj: any): any => {
    // if obj is primitive types
    if (
      obj === null
      || obj === undefined
      || typeof obj !== 'object'
    ) {
      return obj;
    }

    // if argument is an array, recursive this function with each element of array
    if (Array.isArray(obj)) {
      const newArray: any[] = [];
      obj.forEach((element) => {
        const value = this.removeDataProperty(element);
        newArray.push(value);
      });
      return newArray;
    }

    // if argument is a normal object
    const keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === 'data') {
      return this.removeDataProperty(obj.data);
    }
    const newObject: Record<string, any> = {};
    keys.forEach((key) => {
      newObject[key] = this.removeDataProperty(obj[key]);
    });
    return newObject;
  };

  updateDefaultHeaders = (newDefaultHeaders: Record<string, string>) => {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...newDefaultHeaders,
    };
  }

  request = async (url: string, method: string, body?: any, customHeaders = {}, keysIgnoredFromCaseConverter = []) => {
    let endpoint = url;
    if (!url.startsWith('http')) {
      endpoint = this.apiUrl + url;
    }
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    const token = this.auth?.getToken();
    if (token) {
      // Set empty Bearer can cause setRequestHeader error in old safari version
      headers.Authorization = `${this.tokenType} ${token}`;
    }
    let data = null;
    if (body) {
      if (headers['Content-Type'] === 'application/json') {
        data = JSON.stringify(this.caseConverter.camelCaseToSnakeCase(body, keysIgnoredFromCaseConverter));
      } else {
        delete headers['Content-Type'];
        data = body;
      }
    } else {
      delete headers['Content-Type'];
    }

    const fetchOpts: Record<string, any> = {
      method,
      headers,
    };
    if (method !== 'HEAD' && method !== 'GET') {
      fetchOpts.body = data;
    }


    const start = Date.now();
    const response = await fetch(endpoint, fetchOpts);
    const end = Date.now();
    const responseTime = end - start;

    let json = await response.json();
    json = this.removeDataProperty(json);
    json = this.caseConverter.snakeCaseToCamelCase(json, keysIgnoredFromCaseConverter);


    const logData: Record<string, any> = {
      method,
      url: endpoint,
      status: response.status,
      responseTime,
    };

    if (response.status < 200 || response.status >= 300) {
      if (json) {
        logData.error = json;
        this.log?.('error', `API call: ${endpoint}`, logData);
        this.addBreadCrumb?.(method, endpoint, body, headers, json);
        throw new ServerAPIError(json);
      } else {
        logData.error = response.statusText;
        this.log?.('error', `API call: ${endpoint}`, logData);
        this.addBreadCrumb?.(method, endpoint, body, headers, response.statusText);
        throw new Error(response.statusText);
      }
    }

    this.log?.('info', `API call: ${endpoint}`, logData);

    this.addBreadCrumb?.(method, endpoint, body, headers, json);
    return json;
  };

  get = (endpoint: string, params?: Record<string, string> | null, headers = {}, keysIgnoredFromCaseConverter = []) => {
    let url = endpoint;
    if (params) {
      url += `?${QueryString.stringify(this.caseConverter.camelCaseToSnakeCase(params, keysIgnoredFromCaseConverter))}`;
    }
    return this.request(url, 'GET', null, headers, keysIgnoredFromCaseConverter);
  }

  post = (endpoint: string, body?: any, headers = {}, keysIgnoredFromCaseConverter = []) => (
    this.request(endpoint, 'POST', body, headers, keysIgnoredFromCaseConverter)
  )

  put = (endpoint: string, body?: any, headers = {}, keysIgnoredFromCaseConverter = []) => (
    this.request(endpoint, 'PUT', body, headers, keysIgnoredFromCaseConverter)
  )

  del = (endpoint: string, body?: any, headers = {}, keysIgnoredFromCaseConverter = []) => (
    this.request(endpoint, 'DELETE', body, headers, keysIgnoredFromCaseConverter)
  )

  upload = (file: File, headers = {}) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.post(
      '/uploads',
      formData,
      {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
    );
  }
}
