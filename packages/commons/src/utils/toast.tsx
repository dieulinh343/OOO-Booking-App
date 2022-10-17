import React from 'react';
import { toast, Icon } from '@ahaui/react';

type RenderContent = JSX.Element | string | JSX.Element[] | string[];

const showMessage = (type: string, title: string, content: RenderContent) => {
  const renderContent = (content: RenderContent) => (Array.isArray(content)
    ? (content.map(item => (
      <div
        key={typeof item === 'string' ? item : item.key}
        className="u-marginBottomExtraSmall"
      >
        {item}
      </div>
    )))
    : <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
  );

  const render = (iconName: string, title: string, content: RenderContent) => (
    <div className="u-flex u-flexGrow-1">
      <div className="u-marginRightExtraSmall">
        <Icon name={iconName} size="medium" />
      </div>
      <div className="u-flexGrow-1">
        <div className="u-fontMedium u-marginBottomExtraSmall">{title}</div>
        <div className="u-textWordBreak">
          {renderContent(content)}
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'error': {
      toast.error(() => render('alert', title, content));
      break;
    }
    case 'warning':
      toast.warn(() => render('warning', title, content));
      break;
    case 'info':
      toast.info(() => render('informationCircle', title, content));
      break;
    case 'success': {
      toast.success(() => render('checkmarkCircle', title, content));
      break;
    }
    default:
  }
};

// ['a', 'b', 'c'] -> { 0: 'a', 1: 'b', 2: 'c' }
const arrayToObject = (array: any[]) => {
  let result = {};
  array.forEach((item, index) => {
    result = {
      ...result,
      [index]: item,
    };
  });
  return result;
};

/* Flatten the error into this structure:
[
  {
    name: 'long.key',
    message: 'error message',
  },
  ...
]
*/
const flattenErrorData = (data: any, prefix = ''): string | string[] => {
  if (data === null) {
    return [];
  }

  if (Array.isArray(data)) {
    if (data.every(i => (typeof i === 'string'))) {
      // If prefix is empty, display error content only
      const result = prefix ? [`[${prefix}] ${data.join('\n')}`] : data.join('\n');
      return result;
    }
    return flattenErrorData(arrayToObject(data), prefix);
  }

  if (typeof data === 'object') {
    let result: string[] = [];
    Object.keys(data).forEach((key) => {
      const childErrorMessages = flattenErrorData(data[key], prefix ? `${prefix}.${key}` : key);

      if (Array.isArray(childErrorMessages)) {
        result = [
          ...result,
          ...childErrorMessages,
        ];
      } else {
        result = [
          ...result,
          childErrorMessages,
        ];
      }
    });
    return result;
  }

  return prefix ? [`[${prefix}] ${data}`] : [data];
};

/**
 *
 * @param {string|object} error Error
 * @returns {string|array} The error message or a list of error string
 */
const getErrorMsg = (error: any) => {
  let message: string | string[] = '';

  if (
    typeof error === 'object'
    && !Array.isArray(error)
  ) {
    if (error.data && error.data.errorData && Object.keys(error.data.errorData).length > 0) {
      message = flattenErrorData(error.data.errorData);
    }

    if (message.length === 0) {
      if (error.data && error.data.errorMessage) {
        if (error.data.errorMessage === 'Failed to fetch') {
          message = 'Cannot connect to the server. Please try again later.';
        } else {
          message = error.data.errorMessage;
        }
      } else if (error.data && error.data.message) {
        if (error.data.message === 'Failed to fetch') {
          message = 'Cannot connect to the server. Please try again later.';
        } else {
          message = error.data.message;
        }
      } else if (error.message) {
        if (error.message === 'Failed to fetch') {
          message = 'Cannot connect to the server. Please try again later.';
        } else {
          message = error.message;
        }
      } else {
        message = 'Something went wrong.';
      }
    }
  } else {
    message = error || 'Something went wrong.';
  }
  return message;
};

function error(...args: any[]): void {
  if (args.length > 0 && args[0]?.name === 'ClientSessionExpiredError') {
    return;
  }

  if (args[0]?.ignore) {
    return;
  }

  switch (args.length) {
    case 1: {
      showMessage('error', 'Oops', getErrorMsg(args[0]));
      break;
    }
    case 2: {
      showMessage('error', args[1], getErrorMsg(args[0]));
      break;
    }
    default:
      showMessage('error', 'Oops', 'Something went wrong.');
  }
}

const success = (content: RenderContent, title = 'Success') => showMessage('success', title, content);

const info = (content: RenderContent, title = 'Info') => showMessage('info', title, content);

const warning = (content: RenderContent, title = 'Warning') => showMessage('warning', title, content);

export default {
  error,
  success,
  info,
  warning,
  getErrorMsg,
  arrayToObject,
  flattenErrorData,
  showMessage,
};
