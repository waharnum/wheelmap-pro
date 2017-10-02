import {Meteor} from 'meteor/meteor';
import {Apps} from '../apps.js';
import {getAccessibleOrganizationIdsForRoles} from '/imports/both/api/organizations/privileges';
import {publishPublicFields} from '/imports/server/publish';
import {publishPrivateFieldsForMembers} from '/imports/both/api/organizations/server/publications';

publishPublicFields('apps', Apps);
publishPrivateFieldsForMembers('apps', Apps);

// Additionally publish app tokens for organization managers

Meteor.publish('apps.private.withToken', function publish() {
  const organizationIds = getAccessibleOrganizationIdsForRoles(
    this.userId, AdministrativeRoles
  );
  const selector = {organizationId: {$in: organizationIds}};
  const options = {fields: {tokenString: 1}};
  console.log('Publishing apps.private.withToken for user', this.userId, selector, options);
  return Apps.find(selector, options);
});
