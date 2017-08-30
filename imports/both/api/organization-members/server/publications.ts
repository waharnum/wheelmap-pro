import { OrganizationMembersPublicFields, OrganizationMemberVisibleSelectorForUserId } from './fields';
import { Meteor } from 'meteor/meteor';
import { OrganizationMembers } from '../organization-members.js';
import { publishPublicFields } from '../../../../server/publish';
import { publishPrivateFieldsForMembers } from './publishForMembers';

publishPublicFields(
  'organizationMembers',
  OrganizationMembers,
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleSelectorForUserId);

// FIXME: never worked, there are no private fields
// Also publish private fields for members of the organizations you're a member of
publishPrivateFieldsForMembers(
  'organizationMembers',
  OrganizationMembers,
  null,
  OrganizationMemberVisibleSelectorForUserId);
