import * as React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound/NotFound';

import CreateOrganization from './pages/Organizations/Create';
import ShowOrganization from './pages/Organizations/Show';
import ListOrganizations from './pages/Organizations/List';
import EditOrganization from './pages/Organizations/Edit';

import { Accounts, STATES } from 'meteor/std:accounts-ui';

export default (
    <Router>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/admin" component={App}>
          <IndexRoute component={Admin} />
        </Route>
        
        <Route path="/profile" component={() => <Accounts.ui.LoginForm />} />
        <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
        <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
        <Route path="/reset-password" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />
        <Route path="/#/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />
        <Route path="/organizations/list" component={ListOrganizations} />
        <Route path="/organizations/create" component={() => <CreateOrganization afterSubmit={(_id) => { browserHistory.push(`/organizations/${_id}`); }}/>} />
        <Route path="/organizations/edit/:_id" component={EditOrganization} />
        <Route path="/organizations/:_id" component={ShowOrganization} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
);
