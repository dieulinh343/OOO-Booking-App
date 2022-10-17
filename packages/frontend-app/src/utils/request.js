import { RequestUtil, caseConverter } from '@ooo-booking/commons/utils';

import config from 'configuration';
import auth from './auth';

const defaultHeaders = {

};

const { apiUrl } = config;

const request = new RequestUtil({ auth, apiUrl, defaultHeaders, shouldAddBreadCrumb: true });

const getWithoutTokenChecking = request.get;
const postWithoutTokenChecking = request.post;
const putWithoutTokenChecking = request.put;
const delWithoutTokenChecking = request.del;

const putFormDataWithoutPrefix = (endpoint, data, headers) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'file') {
      formData.append('file', data.file, data.file.name);
    } else {
      formData.append(caseConverter.toSnakeCase(key), data[key]);
    }
  });
  return putWithoutTokenChecking(endpoint, formData, {
    ...headers,
    ...defaultHeaders,
    'Content-Type': 'multipart/form-data',
  });
};

const get = getWithoutTokenChecking;
const post = postWithoutTokenChecking;
const put = putWithoutTokenChecking;
const del = delWithoutTokenChecking;
const putFormData = putFormDataWithoutPrefix;

export {
  putFormData,
  get,
  post,
  put,
  del,
};
