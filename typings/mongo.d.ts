declare module 'meteor/mongo' {

  module Mongo {
    interface TypedObserveCallbacks<T> {
      added?(document: T): void;

      addedAt?(document: T, atIndex: number, before: T): void;

      changed?(newDocument: T, oldDocument: T): void;

      changedAt?(newDocument: T, oldDocument: T, indexAt: number): void;

      removed?(oldDocument: T): void;

      removedAt?(oldDocument: T, atIndex: number): void;

      movedTo?(document: T, fromIndex: number, toIndex: number, before: T): void;
    }

    interface TypedObserveChangesCallbacks<T> {
      added?(id: string, fields: T): void;

      addedBefore?(id: string, fields: T, before: T): void;

      changed?(id: string, fields: T): void;

      movedBefore?(id: string, before: T): void;

      removed?(id: string): void;
    }

    export interface Cursor<T> {
      observe(callbacks: TypedObserveCallbacks<T>): Meteor.LiveQueryHandle;

      observeChanges(callbacks: TypedObserveChangesCallbacks<T>): Meteor.LiveQueryHandle;
    }
  }
}
