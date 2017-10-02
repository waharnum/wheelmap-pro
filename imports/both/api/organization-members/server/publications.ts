import {publishFields} from '../../../../server/publish';

import {OrganizationMembers} from '../organization-members.js';
import {Organizations} from '../../organizations/organizations';
import {OrganizationsPublicFields} from '../../organizations/server/fields';

import {
  OrganizationMemberByIdVisibleForUserIdSelector,
  OrganizationMembersPrivateFields,
  OrganizationMembersPublicFields,
  OrganizationMemberVisibleForUserIdSelector,
  OrganizationVisibleForUserIdSelector,
  buildByOrganizationIdAndTokenSelector,
} from './fields';

publishFields(
  'organizationMembers.by_id.private',
  OrganizationMembers,
  OrganizationMembersPrivateFields,
  OrganizationMemberByIdVisibleForUserIdSelector);


publishFields('organizationMembers.by_eventIdAndToken.public',
  OrganizationMembers,
  OrganizationMembersPublicFields,
  buildByOrganizationIdAndTokenSelector,
);

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

