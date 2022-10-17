import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CenterLoading } from '@ooo-booking/commons/components';
import Login from 'components/Login';
import { getInfo } from 'actions/user';
import { getUsers } from 'actions/users';
import ModalContainer from 'components/Modals';
import Layout from './Layout/Index';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const users = useSelector(state => state.users.items);
  const loggedIn = user.loggedIn;

  useEffect(() => {
    if (loggedIn) {
      dispatch(getInfo());
      dispatch(getUsers());
    }
  }, [loggedIn, dispatch]);

  if (!loggedIn) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }

  if (!user.name || users.length === 0) {
    return (
      <CenterLoading />
    );
  }

  return (
    <>
      <Layout />
      <ModalContainer />
    </>
  );
}
