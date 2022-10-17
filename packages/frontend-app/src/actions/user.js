import { UserAction } from 'constants/action';
import { post, get } from 'utils/request';

export const login = (email, password) => ({
  type: UserAction.LOGIN,
  promise: post('/users/sign-in', {
    email,
    password,
  }),
});

export const logout = () => ({
  type: UserAction.LOGOUT,
});

export const getInfo = () => ({
  type: UserAction.GET_INFO,
  promise: get('/users/me'),
});
