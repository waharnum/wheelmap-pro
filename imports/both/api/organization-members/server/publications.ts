import { Meteor } from 'meteor/meteor';

import { publishPublicFields, publishPrivateFields} from '../../../../server/publish';

import { OrganizationMembers } from '../organization-members.js';
import { Organizations } from '../../organizations/organizations';
import { OrganizationsPublicFields } from '../../organizations/server/fields';

import {
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleForUserIdSelector,
  OrganizationVisibleForUserIdSelector,
} from './fields';
import { publishPrivateFieldsForMembers } from './publishForMembers';

publishPublicFields(
  'organizationMembers',
  OrganizationMembers,
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleForUserIdSelector);

publishPrivateFields(
  'organizations.my',
  Organizations,
  OrganizationsPublicFields,
  OrganizationVisibleForUserIdSelector);
