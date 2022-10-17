import { Auth } from '@ooo-booking/commons/utils';
import { AUTH_KEY } from 'constants/common';
import storage from './storage';

const auth = new Auth(storage, AUTH_KEY);

export default auth;
