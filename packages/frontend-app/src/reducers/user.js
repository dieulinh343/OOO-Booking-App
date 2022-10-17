import { UserAction } from 'constants/action';
import auth from 'utils/auth';
import { UserRole } from 'constants/user';

const getInitialState = () => ({
  loggedIn: auth.isAuth(),
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case UserAction.LOGOUT: {
      return {
        ...getInitialState(),
        loggedIn: false,
      };
    }

    case UserAction.LOGIN_SUCCESS: {
      return {
        ...state,
        loggedIn: true,
      };
    }

    case UserAction.GET_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UserAction.GET_INFO_SUCCESS: {
      const user = action.payload;
      const isUser = user.roles?.includes(UserRole.USER);
      const isAdmin = user.roles?.includes(UserRole.ADMIN);
      const isLead = user.roles?.includes(UserRole.LEAD);

      return {
        ...state,
        ...action.payload,
        isUser,
        isAdmin,
        isLead,
        isLoading: false,
      };
    }

    default:
      break;
  }
  return state;
};
