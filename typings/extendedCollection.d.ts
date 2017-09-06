declare module "meteor/mongo" {
  import SimpleSchema from 'simpl-schema';

  module Mongo {    
    export interface Collection<T> {
      schema: SimpleSchema;
      attachSchema(schema: SimpleSchema): void;
      attachJSONSchema(schema: any): void;
      helpers(methods: object): void;
    }
  }
}

// extend existing meteor type
declare module 'meteor/meteor' {
  import SimpleSchema from 'simpl-schema';
  module Meteor {
    export interface User {
      roles?: string[];
    }
    export var users: Mongo.Collection<User>;
  }
}