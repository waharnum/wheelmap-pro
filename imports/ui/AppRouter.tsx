import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import {Router, Route, Redirect, browserHistory} from 'react-router';

import App from './App';

import EnsureUserLoggedIn from './components/EnsureUserLoggedIn';

import HomePage from './pages/Home/HomePage';
import SignUpPage from './pages/Users/SignUpPage';
import ProfilePage from './pages/Users/ProfilePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import EditEventPage from './pages/Events/EditEventPage';
import ShowEventPage from './pages/Events/ShowEventPage';
import SurveyDebugPage from './pages/Survey/SurveyDebugPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import OrganizeEventPage from './pages/Events/OrganizeEventPage';
import EventStatisticsPage from './pages/Events/EventStatisticsPage';
import AccessForbiddenPage from './pages/NotFound/AccessForbiddenPage';
import NoOrganizationsPage from './pages/Organizations/NoOrganizationsPage';
import EditOrganizationPage from './pages/Organizations/EditOrganizationPage';
import ShowOrganizationPage from './pages/Organizations/ShowOrganizationPage';
import EventParticipantsPage from './pages/Events/EventParticipantsPage';
import ListOrganizationsPage from './pages/Organizations/ListOrganizationsPage';
import AccessibilityCloudPage from './pages/Organizations/AccessibilityCloudPage';
import CreateOrganizationPage from './pages/Organizations/CreateOrganizationPage';
import OrganizationMembersPage from './pages/Organizations/OrganizationMembersPage';
import OrganizeOrganizationPage from './pages/Organizations/OrganizeOrganizationPage';
import SignUpForOrganizationPage from './pages/Organizations/SignUpForOrganizationPage';
import OrganizationStatisticsPage from './pages/Organizations/OrganizationStatisticsPage';


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

const AppRouter = (
  <Router>
    <Route component={App}>
      {/* Use meteor.user onEnter, as this gets re-evaluated each time */}
      <Route path="/" onEnter={RedirectAccordingToUser}/>

      {/* weird admin pages */}
      <Route component={(props) => <EnsureUserLoggedIn roles={['admin']} {...props} />}>
        <Route path="/organizations/list" component={ListOrganizationsPage}/>
      </Route>


      {/* organize pages */}
      <Route component={EnsureUserLoggedIn}>
        <Route path="/organizations/none" component={NoOrganizationsPage}/>
        <Route path="/organizations/create" component={CreateOrganizationPage}/>
        <Route path="/organizations/:_id/edit" component={EditOrganizationPage}/>
        <Route path="/organizations/:_id/members" component={OrganizationMembersPage}/>
        <Route path="/organizations/:_id/statistics" component={OrganizationStatisticsPage}/>
        <Route path="/organizations/:_id/organize" component={OrganizeOrganizationPage}
               onEnter={SaveActiveOrganization}/>
        <Route path="/organizations/:_id/accloud" component={AccessibilityCloudPage}/>

        <Route path="/events/create" component={CreateEventPage}/>
        <Route path="/events/:_id/edit" component={EditEventPage}/>
        <Route path="/events/:_id/organize" component={OrganizeEventPage}/>
        <Route path="/events/:_id/statistics" component={EventStatisticsPage}/>
        <Route path="/events/:_id/participants" component={EventParticipantsPage}/>


        <Route path="/places" component={SurveyDebugPage}/>

        <Route path="/profile" component={ProfilePage}/>
      </Route>

      {/* public organization pages  */}
      <Route path="/organizations/:_id/accept-invitation/:token" component={SignUpForOrganizationPage}/>

      <Route path="/organizations/:_id" component={ShowOrganizationPage}/>
      <Route path="/organizations/:_id/place/:place_id" component={ShowOrganizationPage}/>
      <Route path="/organizations/:_id/user" component={ShowOrganizationPage}/>
      <Route path="/organizations/:_id/about" component={ShowOrganizationPage}/>

      {/* public event pages  */}
      <Route path="/organizations/:organization_id/events/:_id" component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/organization" component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/mapping/user" component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/user" component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/place/:place_id" component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/public-invitation/:token"
             component={ShowEventPage}/>
      <Route path="/organizations/:organization_id/events/:_id/private-invitation/:token"
             component={ShowEventPage}/>

      {/* mapping only works with signed in user */}
      <Route component={(route) => <EnsureUserLoggedIn {...route} signInRoute={(p) => {
        const params = p.params as { _id: string, organization_id: string };
        return `/organizations/${params.organization_id}/events/${params._id}/mapping/user`;
      }}/>}>
        <Route path="/organizations/:organization_id/events/:_id/mapping/event-info" component={ShowEventPage}/>
        <Route path="/organizations/:organization_id/events/:_id/mapping/organization"
               component={ShowEventPage}/>
        <Route path="/organizations/:organization_id/events/:_id/mapping" component={ShowEventPage}/>
        <Route path="/organizations/:organization_id/events/:_id/mapping/create-place"
               component={ShowEventPage}/>
        <Route path="/organizations/:organization_id/events/:_id/mapping/edit-place/:place_id"
               component={ShowEventPage}/>
        <Route path="/organizations/:organization_id/events/:_id/mapping/place/:place_id"
               component={ShowEventPage}/>
      </Route>

      <Route path="/welcome" component={HomePage}/>

      {/* user management */}
      <Route path="/signup" component={SignUpPage}/>
      <Route path="/reset-password/:password_reset_token"
             onEnter={(p) => Session.set('Meteor.loginButtons.resetPasswordToken', p.params.password_reset_token)}
             onLeave={() => Session.set('Meteor.loginButtons.resetPasswordToken', null)}
             component={SignUpPage}/>

      {/* Not found pages */}
      <Route path="404" component={NotFoundPage}/>
      <Route path="403" component={AccessForbiddenPage}/>
      <Redirect from="*" to="404"/>
    </Route>
  </Router>
);

export default AppRouter;
