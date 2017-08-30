import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export type PublicationFields = { [id: string]: number };
export type SelectorFunction = (userId: Mongo.ObjectID) => object;

export const publishAndLog = (name: string, publishFunction: Function) => {
  console.log('Publishing', name, '…');
  Meteor.publish(name, publishFunction);
};

// Publishes the given fields for a collection.
// You can optionally supply a function to specify which documents' fields should be published.
const publishFields = <T>(
  publicationName: string,
  collection: Mongo.Collection<T>,
  publicFields: PublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishAndLog(
    `${publicationName}`,
    function publish() {
      const visibleSelector = documentVisibleSelectorForUserId(this.userId);
      const selector = { $and: ([visibleSelector].filter(Boolean)) };
      return collection.find(
        selector,
        Object.assign({}, options, { fields: publicFields }),
      );
    },
  );
};

export const publishPublicFields = <T>(
  publicationName: string,
  collection: Mongo.Collection<T>,
  publicFields: PublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishFields(`${publicationName}.public`, collection,
      publicFields, documentVisibleSelectorForUserId, options);
};

export const publishPrivateFields = <T>(
  publicationName: string,
  collection: Mongo.Collection<T>,
  privateFields: PublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishFields(`${publicationName}.private`, collection,
    privateFields, documentVisibleSelectorForUserId, options);
};
