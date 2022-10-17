import { UserAction } from 'constants/action';
import auth from 'utils/auth';
import storage from 'utils/storage';

export default () => next => async (action) => {
  switch (action.type) {
    case UserAction.LOGOUT: {
      auth.logout();
      storage.removeCookie('authentication');
      break;
    }

    case UserAction.LOGIN_SUCCESS: {
      auth.setAuth({
        ...action.payload,
      });
      // Set cookie to support download file using GET request
      storage.setCookie('authentication', `Bearer ${action.payload.accessToken}`);

      break;
    }

    default:
      break;
  }

  return next(action);
};
