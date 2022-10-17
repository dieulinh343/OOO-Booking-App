import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MyListRequests from './MyListRequests';
import NewOOORequest from './NewOOORequest';
import AdminListRequests from './AdminListRequests';
import LeadListRequests from './LeadListRequests';

export default function MainLayout() {
  return (
    <div
      className="u-flexGrow1 u-backgroundOpaline"
    >
      <Switch>
        <Route path="/my-requests/all" component={MyListRequests} />
        <Route path="/my-requests/create" component={NewOOORequest} />
        <Route path="/mentees-requests/all" component={LeadListRequests} />
        <Route path="/admin-requests/all" component={AdminListRequests} />
        <Redirect to="/my-requests/all" />
      </Switch>
    </div>
  );
}
