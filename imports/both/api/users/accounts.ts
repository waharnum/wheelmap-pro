import * as React from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false,
});

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/signin',
  signUpPath: '/signup',
  resetPasswordPath: '/reset-password',
  profilePath: '/profile',
  onSignedInHook: () => browserHistory.push('/profile'),
  onSignedOutHook: () => browserHistory.push('/signin'),
  minimumPasswordLength: 6,
});

export function acceptInvitationOnLogin() {
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
      },
    );

    c.stop();
  });
}
