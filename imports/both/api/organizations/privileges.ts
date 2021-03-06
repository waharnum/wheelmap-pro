import {isAdmin} from '../../../../imports/both/lib/is-admin';
import {isApproved} from '../../lib/is-approved';
import {OrganizationMembers} from '../organization-members/organization-members';
import {IOrganization, Organizations} from './organizations';
import {uniq} from 'lodash';
import {AdministrativeRoles, RoleType} from '../organization-members/roles';

export function isUserMemberOfOrganizationWithId(userId: Mongo.ObjectID | null | undefined, organizationId: Mongo.ObjectID) {
  if (!userId || !organizationId) {
    return false;
  }
  return OrganizationMembers.find({userId, organizationId}).count() > 0;
}

// An organization is accessible for a user when they are a member or when they are admin.

export function getAccessibleOrganizationIdsForUserId(userId: Mongo.ObjectID) {
  if (!userId) {
    return [];
  }

  const selector = isAdmin(userId) ? {} : {userId};

  return uniq(OrganizationMembers
    .find(selector, {fields: {organizationId: 1}})
    .fetch()
    .map((member) => member.organizationId));
}

// Functions for retrieving which roles a user has in which organization.
// Note that admins are regarded as having all roles in all organizations.
export function getAccessibleOrganizationIdsForRoles(userId: string,
                                                     includedRoles: ReadonlyArray<RoleType> = []): Mongo.ObjectID[] {
  if (!userId) {
    return [];
  }

  if (isAdmin(userId)) {
    return Organizations.find({}, {fields: {_id: 1}})
      .fetch().map((o) => o._id) as Mongo.ObjectID[];
  }

  return uniq(OrganizationMembers.find({
    userId,
    $or: includedRoles.map((role) => ({role})),
  }).map((member) => member.organizationId));
}

// Returns true if the user has one of the given roles in the given organization, false otherwise.
// Admins are considered as having all roles in every organization.
export function userHasRole(userId: string | null | undefined,
                            organizationId: Mongo.ObjectID,
                            includedRoles: ReadonlyArray<RoleType> = []): boolean {
  if (!userId || !organizationId || !includedRoles) {
    return false;
  }

  if (isAdmin(userId)) {
    return true;
  }
  const organizationIds = getAccessibleOrganizationIdsForRoles(userId, includedRoles);
  return organizationIds.includes(organizationId);
}

// Returns true if the user is admin or can manage the organization with the given id, false
// otherwise. Admins are considered as having all roles in every organization.
export function userHasFullAccessToOrganizationId(userId: string | null | undefined,
                                                  organizationId: Mongo.ObjectID | null | undefined): boolean {
  if (!userId || !organizationId) {
    return false;
  }
  return isAdmin(userId) ||
    isApproved(userId) &&
    userHasRole(userId, organizationId, AdministrativeRoles);
}

// Returns the count of administrative roles in an organization
export function usersWithFullAccessToOrganizationCount(organization: IOrganization): number {
  if (!organization) {
    return -1;
  }

  return OrganizationMembers.find(
    {organizationId: organization._id, role: {$in: AdministrativeRoles}},
  ).count();
}

// Returns true if the user is admin or can manage the organization, false
// otherwise. Admins are considered as having all roles in every organization.
export function userHasFullAccessToOrganization(userId: string,
                                                organization: IOrganization): boolean {
  if (!userId || !organization) {
    return false;
  }

  return userHasFullAccessToOrganizationId(userId, organization._id);
}

// Returns true if the user is admin or can manage the organization referenced in the given MongoDB
// document, false otherwise.
export function userHasFullAccessToReferencedOrganization(userId: string | null | undefined,
                                                          doc: { organizationId: Mongo.ObjectID }): boolean {
  if (!userId || !doc) {
    return false;
  }

  return userHasFullAccessToOrganizationId(userId, doc.organizationId);
}

// Returns true if the user is admin or can manage the organization referenced in the given MongoDB
// document, false otherwise.
export function userHasFullAccessToReferencedOrganizationByMethod(userId: string,
                                                                  doc: { getOrganizationId: () => (Mongo.ObjectID | null) }): boolean {
  if (!userId || !doc) {
    return false;
  }

  return userHasFullAccessToOrganizationId(userId, doc.getOrganizationId());
}
