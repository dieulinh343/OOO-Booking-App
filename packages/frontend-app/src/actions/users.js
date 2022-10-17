import { UsersAction } from 'constants/action';
import { get } from 'utils/request';

export const getUsers = () => ({
  type: UsersAction.GET_USERS,
  promise: get('/users'),
});
