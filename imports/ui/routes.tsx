import * as React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';

import App from './App';
import Home from './pages/Home/HomePage';
import NotFound from './pages/NotFound/NotFoundPage';

import CreateOrganization from './pages/Organizations/CreateOrganizationPage';
import ShowOrganization from './pages/Organizations/ShowOrganizationPage';
import ListOrganizations from './pages/Organizations/ListOrganizationsPage';
import EditOrganization from './pages/Organizations/EditOrganizationPage';
import EnsureUserLoggedIn from './components/EnsureUserLoggedIn';

import AppLayoutScrollable from './_layouts/AppLayoutScrollable';

import { Accounts, STATES } from 'meteor/std:accounts-ui';

export default (
    <Router>
      <Route component={App}>
        <Redirect from="/" to="/welcome"/>
        <Route path="/welcome" component={Home} />
                
        <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
        <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
        <Route path="/reset-password" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />
        <Route path="/#/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />

        <Route component={EnsureUserLoggedIn}>
          <Route path="/profile" component={() => <Accounts.ui.LoginForm formState={STATES.PROFILE} />} />
          <Route path="/organizations/list" component={ListOrganizations} />
          <Route path="/organizations/create" component={() => <CreateOrganization afterSubmit={(_id) => { browserHistory.push(`/organizations/${_id}`); }}/>} />
          <Route path="/organizations/edit/:_id" component={EditOrganization} />
          <Route path="/organizations/:_id" component={ShowOrganization} />
        </Route>

        <Route path="/testlayout" component={AppLayoutScrollable} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
);
