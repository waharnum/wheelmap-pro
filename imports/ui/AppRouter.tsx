import * as React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';

import App from './App';

import CreateOrganizationPage from './pages/Organizations/CreateOrganizationPage';
import ShowOrganizationPage from './pages/Organizations/ShowOrganizationPage';
import ListOrganizationsPage from './pages/Organizations/ListOrganizationsPage';
import EditOrganizationPage from './pages/Organizations/EditOrganizationPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import HomePage from './pages/Home/HomePage';

import EnsureUserLoggedIn from './components/EnsureUserLoggedIn';

import AppLayoutScrollable from './_layouts/AppLayoutScrollable';

// tslint:disable:jsx-no-lambda
// tslint:disable:max-line-length
const AppRouter = (
    <Router>
      <Route component={App}>
        
        <Route component={EnsureUserLoggedIn}>
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/profile" component={() => <Accounts.ui.LoginForm formState={STATES.PROFILE} />} />
          <Route path="/organizations/list" component={ListOrganizationsPage} />
          <Route path="/organizations/create" component={CreateOrganizationPage} />
          <Route path="/organizations/edit/:_id" component={EditOrganizationPage} />
          <Route path="/organizations/:_id" component={ShowOrganizationPage} />
        </Route>
  
        {/* Use meteor.user onEnter, as this gets re-evaluated each time */}
        <Route path="/" onEnter={() => { browserHistory.replace(Meteor.user() ? '/dashboard' : '/welcome'); }} />

        <Route path="/welcome" component={HomePage} />
        <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
        <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
        <Route path="/reset-password" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />
        <Route path="/#/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />

        <Route path="/testlayout" component={AppLayoutScrollable} />

        <Route path="404" component={NotFoundPage} />
        <Redirect from="*" to="404" />
      </Route>
    </Router>
);

export default AppRouter;