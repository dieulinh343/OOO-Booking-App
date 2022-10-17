import { combineReducers } from 'redux';
import modal from './modal';
import user from './user';
import users from './users';

const reducers = {
  modal,
  user,
  users,
};

const combined = combineReducers(reducers);

export default combined;
