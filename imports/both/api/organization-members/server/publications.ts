import {Meteor} from 'meteor/meteor';

import {publishFields} from '../../../../server/publish';

import {OrganizationMembers} from '../organization-members.js';
import {Organizations} from '../../organizations/organizations';
import {OrganizationsPublicFields} from '../../organizations/server/fields';

import {
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleForUserIdSelector,
  OrganizationVisibleForUserIdSelector,
} from './fields';

import {publishPrivateFieldsForMembers} from './publishForMembers';

publishFields(
  'organizationMembers.private',
  OrganizationMembers,
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleForUserIdSelector);

publishFields(
  'organizations.my.private',
  Organizations,
  OrganizationsPublicFields,
  OrganizationVisibleForUserIdSelector);
