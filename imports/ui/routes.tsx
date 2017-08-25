import * as React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Router, Route, IndexRoute } from 'react-router';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound/NotFound';


function acceptInvitationOnLogin() {
  Tracker.autorun((c) => {
    const invitationToken = Session.get('invitationToken');
    const organizationId = Session.get('organizationId');

    if (!invitationToken || !organizationId) {
      return;
    }

    if (!Meteor.userId()) {
      console.log('Waiting for user to sign in / sign up to accept invitation…');
      return;
    }

    console.log('Accepting invitation to collection…');

    Meteor.call(
      'organizationMembers.acceptInvitation',
      { organizationId, invitationToken },
      (error) => {
        if (error) {
          alert(`Could not accept invitation: ${error.reason}`); // eslint-disable-line no-alert
          window.location.href = '/';
          return;
        }
        Session.set('invitationToken', null);
        Session.set('organizationId', null);
        window.location.href = '/';
      }
    );

    c.stop();
  });
}

<Route path='/organizations/:_id/accept-invitation/:invitationToken' onEnter={() => {
    Session.set('invitationToken', this.getParam('invitationToken'));
    Session.set('organizationId', this.getParam('_id'));
    if (!Meteor.userId()) {
        window.location.href = '/';
    }
    acceptInvitationOnLogin();
}} />


export default (
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
            <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
            {/* <Route path="/hello/:name" component={ Hello } /> */}
            <Route path="/admin" component={App}>
                <IndexRoute component={Admin} />
            </Route>
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);
