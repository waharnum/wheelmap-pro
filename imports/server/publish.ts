import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export interface IPublicationFields { [id: string]: number; };
export type SelectorFunction = (userId: Mongo.ObjectID) => Mongo.Selector | null;

export const publishAndLog = (name: string, publishFunction: Function) => {
  console.log('Publishing', name, '…');
  Meteor.publish(name, publishFunction);
};

// Publishes the given fields for a collection.
// You can optionally supply a function to specify which documents' fields should be published.
const publishFields = (
  publicationName: string,
  collection: Mongo.Collection<any>,
  publicFields: IPublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishAndLog(
    publicationName,
    function publish() {
      const visibleSelector = documentVisibleSelectorForUserId(this.userId);

      // Leave in for debugging rights issues
      // if (!visibleSelector) {
      //   console.log('Received null selector for', publicationName);
      // } else {
      //   console.log('Using selector', visibleSelector, 'for', publicationName);
      // }

      return collection.find(
        // if there is no selector, search with a selector that will yield nothing
        visibleSelector || {_id: -1},
        Object.assign({}, options, { fields: publicFields }),
      );
    },
  );
};

export const publishPublicFields = (
  publicationName: string,
  collection: Mongo.Collection<any>,
  publicFields: IPublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishFields(`${publicationName}.public`, collection,
      publicFields, documentVisibleSelectorForUserId, options);
};

export const publishPrivateFields = (
  publicationName: string,
  collection: Mongo.Collection<any>,
  privateFields: IPublicationFields,
  documentVisibleSelectorForUserId: SelectorFunction = () => ({}),
  options: object = {},
) => {
  publishFields(`${publicationName}.private`, collection,
    privateFields, documentVisibleSelectorForUserId, options);
};
