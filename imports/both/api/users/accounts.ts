import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {Session} from 'meteor/session';
import {Accounts} from 'meteor/std:accounts-ui';
import {LocationDescriptor} from 'history';
import {browserHistory} from 'react-router';
import SimpleSchema from 'simpl-schema';
import {BoolField} from 'uniforms-bootstrap3';
import {t} from 'c-3po';

export function setLoginRedirect(redirect: LocationDescriptor | null) {
  Session.set('loginRedirect', redirect);
};

Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false,
});

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/signup',
  signUpPath: '/signup',
  resetPasswordPath: '/reset-password',
  profilePath: '/profile',
  requireEmailVerification: true,
  onSignedInHook: () => {
    const redirect = Session.get('loginRedirect');
    setLoginRedirect(null);
    redirect ? browserHistory.replace(redirect) : browserHistory.push('/');
  },
  onSignedOutHook: () => {
    setLoginRedirect(null);
    browserHistory.push('/');
  },
  onPostSignUpHook: () => {
    const redirect = Session.get('loginRedirect');
    setLoginRedirect(null);
    redirect ? browserHistory.replace(redirect) : browserHistory.push('/');
  },
  minimumPasswordLength: 6,
});

export function loginGuestUser(username, callback) {
  if (!Meteor.userId()) {
    Accounts.callLoginMethod({
      methodArguments: [{
        custom: 'guest',
        username,
      }],
      userCallback: function (error, result) {
        if (error) {
          callback && callback(error);
        } else {
          callback && callback();
        }
      },
    });
  }
}

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
      {organizationId, invitationToken},
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

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const GuestUserSchema = new SimpleSchema({
  username: {
    label: t`What is your name (or nickname)?`,
    type: String,
    min: 3,
    uniforms: {
      placeholder: t`e.g. Petra`,
    },
  },
  toc: {
    label: t`Terms and Conditions`,
    type: Boolean,
    uniforms: {
      help: t`Provide link to t&c here`,
      component: BoolField,
    },
    allowedValues: [true],
  },
});

export const ClaimAccountSchema = new SimpleSchema({
  email: {
    label: t`email`,
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      placeholder: t`e.g. petra@example.com`,
    },
  },
});
