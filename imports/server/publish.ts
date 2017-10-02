import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export interface IPublicationFields {
  [id: string]: number;
};
export type SelectorFunctionByUser = (userId: Mongo.ObjectID, ...publicationArgs: any[]) => Mongo.Selector | null;

export function combineSelectorAnd(first: SelectorFunctionByUser | Mongo.Selector,
                                   second: SelectorFunctionByUser): SelectorFunctionByUser {

  return (userId: Mongo.ObjectID) => {
    const firstSelector = first instanceof Function ? first(userId) : first;
    const secondSelector = second instanceof Function ? second(userId) : second;

    // if either returned null, nothing should be found
    if (!first || !second) {
      return null;
    }

    return {$and: [firstSelector, secondSelector]};
  };
}

export function publishAndLog(name: string, publishFunction: (...args: any[]) => any) {
  console.log('Publishing', name, '…');
  Meteor.publish(name, publishFunction);
};

// Publishes the given fields for a collection.
// You can optionally supply a function to specify which documents' fields should be published.
export function publishFields(publicationName: string,
                              collection: Mongo.Collection<any>,
                              fields: IPublicationFields,
                              documentVisibleSelectorForUserId: SelectorFunctionByUser = () => ({}),
                              options: object = {}) {
  publishAndLog(
    publicationName,
    function publish(...publicationArgs: any[]) {
      const visibleSelector = documentVisibleSelectorForUserId(this.userId, ...publicationArgs);

      // Leave in for debugging rights issues
      // if (!visibleSelector) {
      //   console.log('Received null selector for', publicationName);
      // } else {
      //   console.log('Using selector', visibleSelector, 'for', publicationName);
      // }
      //
      // console.log('Using fields', fields, 'for', publicationName);

      const results = collection.find(
        // if there is no selector, search with a selector that will yield nothing
        visibleSelector || {_id: -1},
        Object.assign({}, options, {fields}),
      );

      // console.log('Results for', publicationName, results.fetch());

      return results;
    },
  );
};
