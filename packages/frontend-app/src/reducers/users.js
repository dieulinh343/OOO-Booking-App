import { UserAction, UsersAction } from 'constants/action';

const INITIAL_STATE = {
  items: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UsersAction.GET_USERS_SUCCESS: {
      return {
        ...state,
        items: action.payload,
      };
    }

    case UserAction.LOGOUT: {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
};
