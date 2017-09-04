import { setActiveOrganization } from '../both/api/organizations/organizations';
import * as React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';

import App from './App';

import HomePage from './pages/Home/HomePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import EditEventPage from './pages/Events/EditEventPage';
import OrganizeEventPage from './pages/Events/OrganizeEventPage';
import AccessForbiddenPage from './pages/NotFound/AccessForbiddenPage';
import NoOrganizationsPage from './pages/Organizations/NoOrganizationsPage';
import ShowOrganizationPage from './pages/Organizations/ShowOrganizationPage';
import EditOrganizationPage from './pages/Organizations/EditOrganizationPage';
import ListOrganizationsPage from './pages/Organizations/ListOrganizationsPage';
import CreateOrganizationPage from './pages/Organizations/CreateOrganizationPage';
import OrganizeOrganizationPage from './pages/Organizations/OrganizeOrganizationPage';

import EnsureUserLoggedIn from './components/EnsureUserLoggedIn';

{/* Only as styling props – has to be removed later !*/ }
import AppLayoutScrollableAdmin from './_layouts/AppLayoutScrollableAdmin';
import AppLayoutPublicOrganization from './_layouts/AppLayoutPublicOrganization';
import AppLayoutPublicEvent from './_layouts/AppLayoutPublicEvent';

const RedirectAccordingToUser = () => {
  const user = Meteor.user();

  if (!user) {
    browserHistory.replace('/welcome');
    return;
  }

  const organizationId = user.profile.activeOrganizationId;
  if (!organizationId) {
    browserHistory.replace('/organizations/none');
    return;
  }

  // TODO: check deleted or missing organizations
  browserHistory.replace(`/organizations/${organizationId}/organize`);
};

const SaveActiveOrganization = (nextState) => {
  const activeOrganizationId = nextState.params._id;
  if (activeOrganizationId === Meteor.user().profile.activeOrganizationId) {
    return;
  }
  Meteor.call('users.updateActiveOrganization', activeOrganizationId);
};

// tslint:disable:jsx-no-lambda
// tslint:disable:max-line-length
const AppRouter = (
  <Router>
    <Route component={App}>
      {/* Use meteor.user onEnter, as this gets re-evaluated each time */}
      <Route path="/" onEnter={RedirectAccordingToUser} />

      {/* weird admin pages */}
      <Route component={(props) => <EnsureUserLoggedIn roles={['admin']} {...props} />}>
        <Route path="/organizations/list" component={ListOrganizationsPage} />
      </Route>

      {/* organize pages */}
      <Route component={EnsureUserLoggedIn}>
        
        <Route path="/profile" component={() => <Accounts.ui.LoginForm formState={STATES.PROFILE} />} />

        <Route path="/organizations/none" component={NoOrganizationsPage} />
        <Route path="/organizations/create" component={CreateOrganizationPage} />
        <Route path="/organizations/:_id/edit" component={EditOrganizationPage} />
        <Route path="/organizations/:_id/organize" component={OrganizeOrganizationPage} onEnter={SaveActiveOrganization} />

        <Route path="/events/create" component={CreateEventPage} />
        <Route path="/events/:_id/edit" component={EditEventPage} />
        <Route path="/events/:_id" component={OrganizeEventPage} />
      </Route>
      
      {/* public pages  */}
      <Route path="/organizations/:_id" component={ShowOrganizationPage} />

      <Route path="/welcome" component={HomePage} />

      {/* user management */}
      <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
      <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
      <Route path="/reset-password" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />
      <Route path="/#/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET} />} />

      {/* only as styling props – has to be removed later !*/}
      <Route path="/testlayoutadmin" component={AppLayoutScrollableAdmin} />
      <Route path="/testlayoutpublicorg" component={AppLayoutPublicOrganization} />
      <Route path="/testlayoutpublicevent" component={AppLayoutPublicEvent} />

      {/* Not found pages */}
      <Route path="404" component={NotFoundPage} />
      <Route path="403" component={AccessForbiddenPage} />
      <Redirect from="*" to="404" />
    </Route>
  </Router>
);

export default AppRouter;
