import { getActiveOrganizationId } from '../organizations/organizations';
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { LocationDescriptor } from 'history';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

export function setLoginRedirect(redirect: LocationDescriptor | null) {
  Session.set('loginRedirect', redirect);
};

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
  onSignedInHook: () => {
    const redirect = Session.get('loginRedirect');
    setLoginRedirect(null);
    redirect ? browserHistory.replace(redirect) : browserHistory.push('/');
  },
  onSignedOutHook: () => {
    setLoginRedirect(null);
    browserHistory.push('/');
  },
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
          console.error(`Could not accept invitation: ${error.reason}`);
          browserHistory.replace('/');
          return;
        }
        Session.set('invitationToken', null);
        Session.set('organizationId', null);
        browserHistory.replace('/');
      },
    );

    c.stop();
  });
}
