declare module 'meteor/mongo' {
  import SimpleSchema from 'simpl-schema';

  module Mongo {
    export interface Collection<T> {
      schema: SimpleSchema;

      attachSchema(schema: SimpleSchema): void;

      attachJSONSchema(schema: any): void;

      helpers(methods: object): void;

      _name: string;
    }
  }
}

// extend existing meteor type
declare module 'meteor/meteor' {
  module Meteor {
    export interface User {
      roles?: string[];
      guest?: boolean;
    }

    export var users: Mongo.Collection<User>;
  }
}
