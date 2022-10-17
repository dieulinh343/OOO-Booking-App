import CaseConverter from 'utils/caseConverter';
import { Dispatch } from 'redux';

interface ClientSessionExpiredErrorData {
  errorData: {
    type: string;
    oldSessionId: string;
    newSessionId: string;
  };
}

class ClientSessionExpiredError extends Error {
  name = 'ClientSessionExpiredError';

  data: ClientSessionExpiredErrorData;

  stack: string | undefined;

  constructor(json: ClientSessionExpiredErrorData) {
    super();
    this.data = json;
    this.stack = (new Error()).stack;
  }
}

export default ({ dispatch, getState }: {
  dispatch: Dispatch<any>,
  getState: () => any
}) => (next: (action: any) => void) => async (action: any) => {
  // Thunk
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  // Promise
  if (!action.promise) {
    return next(action);
  }

  const {
    promise: promisePayload,
    shouldCancelOnLogout = true,
    type,
    ...rest
  } = action;

  const oldSessionId = getState()?.user?.sessionId;

  // Dispatch original action
  next({ type, ...rest });

  const promise = (typeof promisePayload === 'function') ? promisePayload(dispatch, getState) : promisePayload;

  let nextAction;
  let returnValue;

  try {
    const result = await promise;
    // Dispatch _SUCCESS action
    nextAction = {
      type: `${type}_SUCCESS`,
      payload: result,
      options: CaseConverter.snakeCaseToCamelCase(rest.payload),
    };

    returnValue = {
      success: true,
      result,
    };
  } catch (error) {
    console.log('Request failed: ', error);

    // Dispatch _FAILURE action
    nextAction = {
      type: `${type}_FAILURE`,
      payload: error,
      options: CaseConverter.snakeCaseToCamelCase(rest.payload),
    };

    returnValue = {
      success: false,
      error,
    };
  }

  // Check if the session is expired (user logged out)
  if (oldSessionId && shouldCancelOnLogout) {
    const newSessionId = getState()?.user?.sessionId;
    if (oldSessionId !== newSessionId) {
      // Do not trigger the next action
      nextAction = null;
      // Return error
      const error = new ClientSessionExpiredError({
        errorData: {
          type,
          oldSessionId,
          newSessionId,
        },
      });
      console.error(error);
      returnValue = {
        success: false,
        error,
      };
    }
  }

  nextAction && next(nextAction);
  return returnValue;
};
