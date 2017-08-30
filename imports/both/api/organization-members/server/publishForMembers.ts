import {getAccessibleOrganizationIdsForUserId} from '../../organizations/privileges';
import {SelectorFunction, PublicationFields} from '../../../../server/publish';

// Publishes private fields for all documents that reference an organization you
// are member of.
// You can optionally supply a function to limit the retrieved documents to a more specific set.
// The function is called with a userId argument and should return a selector.
export const publishPrivateFieldsForMembers = <T>(publicationName: string,
                                                  collection: Mongo.Collection<T>,
                                                  privateFields: PublicationFields,
                                                  selectorFn: SelectorFunction = () => ({}),
                                                  options: any = {} ) => {
  const name = `${publicationName}.private`;

  console.log('Publishing', name, 'for referred organization members…');

  Meteor.publish(
    name,
    function publish() {
      if (!privateFields || privateFields == null) {
        this.ready();
        return [];
      }
      const organizationIds = getAccessibleOrganizationIdsForUserId(this.userId);

      const specifiedSelector = selectorFn ? selectorFn(this.userId) : {};
      const selectorWithOrganizationId =
          Object.assign({}, specifiedSelector, { organizationId: { $in: organizationIds } });

      return collection.find(
        selectorWithOrganizationId,
        Object.assign({}, options, { fields: privateFields }),
      );
    },
  );
};
