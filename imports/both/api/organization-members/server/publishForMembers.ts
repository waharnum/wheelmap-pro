import {getAccessibleOrganizationIdsForUserId} from '../../organizations/privileges';

// Publishes private fields for all documents that reference an organization you are member of.
// You can optionally supply a function to limit the retrieved documents to a more specific set.
// The function is called with a userId argument and should return a selector.
export const publishPrivateFieldsForMembers = <T>(publicationName: string,
                                                  collection: Mongo.Collection<T>,
                                                  privateFields: { [id: string]: number },
                                                  selectorFn: (userId: Mongo.ObjectID) => object = () => ({}),
                                                  options: any = {} ) => {
  const name = `${publicationName}.private`;

  console.log('Publishing', name, 'for referred organization members…');

  Meteor.publish(
    name,
    function publish() {
      if (!privateFields) {
        this.ready();
        return [];
      }

      const organizationIds = getAccessibleOrganizationIdsForUserId(this.userId);

      const specifiedSelector = selectorFn(this.userId);
      const selectorWithOrganizationId =
          Object.assign({}, specifiedSelector, { organizationId: { $in: organizationIds } });

      return collection.find(
        selectorWithOrganizationId,
        Object.assign({}, options, { fields: privateFields }),
      );
    },
  );
};