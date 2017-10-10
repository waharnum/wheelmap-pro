import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import {Router, Route, Redirect, browserHistory} from 'react-router';

import App from './App';

import HomePage from './pages/Home/HomePage';
import SignUpPage from './pages/Users/SignUpPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import EditEventPage from './pages/Events/EditEventPage';
import ShowEventPage from './pages/Events/ShowEventPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import OrganizeEventPage from './pages/Events/OrganizeEventPage';
import SignUpForEventPage from './pages/Events/SignUpForEventPage';
import EventStatisticsPage from './pages/Events/EventStatisticsPage';
import AccessForbiddenPage from './pages/NotFound/AccessForbiddenPage';
import NoOrganizationsPage from './pages/Organizations/NoOrganizationsPage';
import ShowOrganizationPage from './pages/Organizations/ShowOrganizationPage';
import EditOrganizationPage from './pages/Organizations/EditOrganizationPage';
import EventParticipantsPage from './pages/Events/EventParticipantsPage';
import ListOrganizationsPage from './pages/Organizations/ListOrganizationsPage';
import CreateOrganizationPage from './pages/Organizations/CreateOrganizationPage';
import OrganizationMembersPage from './pages/Organizations/OrganizationMembersPage';
import PublicSignUpForEventPage from './pages/Events/PublicSignUpForEventPage';
import OrganizeOrganizationPage from './pages/Organizations/OrganizeOrganizationPage';
import SignUpForOrganizationPage from './pages/Organizations/SignUpForOrganizationPage';
import OrganizationStatisticsPage from './pages/Organizations/OrganizationStatisticsPage';

import EnsureUserLoggedIn from './components/EnsureUserLoggedIn';

{/* Only as styling props – has to be removed later !*/
}
import AppLayoutScrollableAdmin from './_layouts/AppLayoutScrollableAdmin';
import AppLayoutPublicOrganization from './_layouts/AppLayoutPublicOrganization';
import AppLayoutPublicEvent from './_layouts/AppLayoutPublicEvent';
import ProfilePage from './pages/Users/ProfilePage';

const RedirectAccordingToUser = () => {
  const user = Meteor.user();

  if (!user) {
    browserHistory.replace('/welcome');
    return;
  }

  console.log(user);

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
      <Route path="/" onEnter={RedirectAccordingToUser}/>

      {/* weird admin pages */}
      <Route component={(props) => <EnsureUserLoggedIn roles={['admin']} {...props} />}>
        <Route path="/organizations/list" component={ListOrganizationsPage}/>
      </Route>

      {/* Invitations */}
      <Route path="/organizations/:_id/accept-invitation/:token" component={SignUpForOrganizationPage}/>
      <Route path="/events/:_id/accept-invitation/:token" component={SignUpForEventPage}/>
      <Route path="/events/:_id/public-invitation/:token" component={PublicSignUpForEventPage}/>
      <Route path="/signup" component={SignUpPage}/>

      {/* organize pages */}
      <Route component={EnsureUserLoggedIn}>
        <Route path="/organizations/none" component={NoOrganizationsPage}/>
        <Route path="/organizations/create" component={CreateOrganizationPage}/>
        <Route path="/organizations/:_id/edit" component={EditOrganizationPage}/>
        <Route path="/organizations/:_id/members" component={OrganizationMembersPage}/>
        <Route path="/organizations/:_id/statistics" component={OrganizationStatisticsPage}/>
        <Route path="/organizations/:_id/organize" component={OrganizeOrganizationPage}
               onEnter={SaveActiveOrganization}/>

        <Route path="/events/create" component={CreateEventPage}/>
        <Route path="/events/:_id/edit" component={EditEventPage}/>
        <Route path="/events/:_id/organize" component={OrganizeEventPage}/>
        <Route path="/events/:_id/statistics" component={EventStatisticsPage}/>
        <Route path="/events/:_id/participants" component={EventParticipantsPage}/>

        <Route path="/profile" component={ProfilePage}/>
      </Route>

      {/* public pages  */}
      <Route path="/organizations/:_id" component={ShowOrganizationPage}/>
      <Route path="/events/:_id" component={ShowEventPage}/>

      <Route path="/welcome" component={HomePage}/>

      {/* user management */}
      <Route path="/reset-password" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET}/>}/>
      <Route path="/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET}/>}/>
      <Route path="/#/reset-password/:id" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET}/>}/>

      {/* only as styling props – has to be removed later !*/}
      <Route path="/testlayoutadmin" component={AppLayoutScrollableAdmin}/>
      <Route path="/testlayoutpublicorg" component={AppLayoutPublicOrganization}/>
      <Route path="/testlayoutpublicevent" component={AppLayoutPublicEvent}/>

      {/* Not found pages */}
      <Route path="404" component={NotFoundPage}/>
      <Route path="403" component={AccessForbiddenPage}/>
      <Redirect from="*" to="404"/>
    </Route>
  </Router>
);

export default AppRouter;
