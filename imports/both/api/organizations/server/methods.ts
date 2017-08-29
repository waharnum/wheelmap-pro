import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { OrganizationMembers } from '../../organization-members/organization-members';
import { IOrganization, Organizations } from '../organizations';

export const insert = new ValidatedMethod({
  name: 'organizations.insert',
  validate: Organizations.schema.validator(),
  run(doc: IOrganization) {
    console.log('Inserting organization and first membership:', doc, 'for user id', this.userId);
    const organizationId = Organizations.insert(doc);
    OrganizationMembers.insert({
      organizationId,
      userId: this.userId,
      role: 'manager',
    });
    return organizationId;
  },
});

export const remove = new ValidatedMethod({
  name: 'organizations.remove',
  validate: new SimpleSchema({
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ organizationId }) {
    const organization = Organizations.findOne(organizationId);

    if (!organization.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to remove this organization.');
    }

    OrganizationMembers.remove({ organizationId });
    Organizations.remove(organizationId);
  },
});
