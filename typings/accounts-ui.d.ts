declare module 'meteor/std:accounts-ui' {
  export const Accounts;
  export const STATES;
}

declare module 'meteor/accounts-base' {
  module Accounts {
    export function registerLoginHandler(name: string, hook: (options: any) => any | undefined);

    export function insertUserDoc(options: any, user: Meteor.User);

    export function onLogout(callback: (params: { user: Meteor.User, connection: Meteor.Connection }) => void);
  }
}
