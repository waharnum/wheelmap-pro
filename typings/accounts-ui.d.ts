declare module 'meteor/std:accounts-ui' {
  export const Accounts;
  export const STATES;
}

declare module 'meteor/accounts-base' {
  module Accounts {
    export function registerLoginHandler(name: string, hook: (options: any) => any | undefined);

    export function insertUserDoc(options: any, user: Meteor.User);

    export function onLogout(callback: (params: { user: Meteor.User, connection: Meteor.Connection }) => void);

    export function addEmail(userId: string, email: string, force: boolean);

    export function setPassword(userId: string, password: string, options: any | undefined);

    export function sendEnrollmentEmail(userId: string, email: string);

    export function onCreateUser(callback: (options: any, user: Meteor.User) => Meteor.User);

    export function config(any);

    export const urls: {
      resetPassword: (token: string) => string;
    };
  }
}
