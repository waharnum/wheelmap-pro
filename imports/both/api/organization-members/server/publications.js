import { Meteor } from 'meteor/meteor';
import { OrganizationMembers } from '../organization-members.js';
import { publishPublicFields } from '/imports/server/publish';
import { publishPrivateFieldsForMembers } from '/imports/both/api/organizations/server/publications';

publishPublicFields('organizationMembers', OrganizationMembers);

// Also publish private fields for members of the organizations you're a member of
publishPrivateFieldsForMembers('organizationMembers', OrganizationMembers);

publishPublicFields('users', Meteor.users);
