import {publishFields} from '../../../../server/publish';

import {OrganizationMembers} from '../organization-members.js';
import {Organizations} from '../../organizations/organizations';
import {OrganizationsPublicFields} from '../../organizations/server/fields';

import {
  OrganizationMemberByIdVisibleForUserIdSelector,
  OrganizationMembersPrivateFields,
  OrganizationMemberVisibleForUserIdSelector,
  OrganizationVisibleForUserIdSelector,
} from './fields';

publishFields(
  'organizationMembers.by_id.private',
  OrganizationMembers,
  OrganizationMembersPrivateFields,
  OrganizationMemberByIdVisibleForUserIdSelector);


publishFields(
  'organizationMembers.private',
  OrganizationMembers,
  OrganizationMembersPrivateFields,
  OrganizationMemberVisibleForUserIdSelector);

publishFields(
  'organizations.my.private',
  Organizations,
  OrganizationsPublicFields,
  OrganizationVisibleForUserIdSelector);
