import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';
import {Organizations} from '../../organizations/organizations';
import {userHasFullAccessToOrganization, usersWithFullAccessToOrganizationCount} from '../../organizations/privileges';
import {OrganizationMembers} from '../organization-members';
import {t} from 'c-3po';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {acceptInvitation, inviteUserToOrganization} from './invitations';
import {MemberInviteSchema} from '../schema';
import {AdministrativeRoles, RoleType} from '../roles';

export const insert = new ValidatedMethod({
  name: 'organizationMembers.invite',
  validate: MemberInviteSchema.validator(),
  run({invitationEmailAddresses, organizationId}) {

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const organization = Organizations.findOne({_id: organizationId});
    if (!organization) {
      throw new Meteor.Error(404, t`Organization not found`);
    }

    if (!userHasFullAccessToOrganization(this.userId, organization)) {
      throw new Meteor.Error(403,
        t`You are not authorized to invite users to this organization.`);
    }

    return invitationEmailAddresses.map((invitationEmailAddress) => {
      return inviteUserToOrganization(invitationEmailAddress, organizationId, 'member');
    });
  },
});

export const changeRole = new ValidatedMethod({
  name: 'organizationMembers.changeRole',
  validate: OrganizationMembers.schema.pick('_id', 'role').validator(),
  run({_id, role}: { _id: Mongo.ObjectID, role: RoleType }) {
    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const organizationMember = OrganizationMembers.findOne(_id);
    if (!organizationMember) {
      throw new Meteor.Error(404, t`Organization member not found`);
    }

    const organizationId = organizationMember.organizationId;
    const organization = Organizations.findOne(organizationId);
    if (!organization) {
      throw new Meteor.Error(404, t`Organization not found`);
    }

    const hasFullAccess = userHasFullAccessToOrganization(this.userId, organization);
    const isOwnMembership = organizationMember.userId === this.userId;
    const isAuthorized = hasFullAccess || isOwnMembership;
    if (!isAuthorized) {
      throw new Meteor.Error(403, t`Not authorized.`);
    }

    const isLastAdminMembership =
      AdministrativeRoles.includes(organizationMember.role) &&
      !AdministrativeRoles.includes(role) &&
      usersWithFullAccessToOrganizationCount(organization) === 1;
    if (isLastAdminMembership) {
      throw new Meteor.Error(403, t`Cannot revoke the membership of the last admin of an organization.`);
    }
    return OrganizationMembers.update(_id, {$set: {role}});
  },
});


export const accept = new ValidatedMethod({
  name: 'organizationMembers.acceptInvitation',
  validate: OrganizationMembers.schema.pick('organizationId', 'invitationToken').validator(),
  run({organizationId, invitationToken}) {
    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const organization = Organizations.findOne({_id: organizationId});

    if (!organization) {
      throw new Meteor.Error(404, t`Organization not found`);
    }

    return acceptInvitation(this.userId, organizationId, invitationToken);
  },
});

Meteor.methods({
  'organizationMembers.remove'(_id: Mongo.ObjectID) {
    // always check agains mongo injection
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const organizationMember = OrganizationMembers.findOne(_id);
    if (!organizationMember) {
      throw new Meteor.Error(404, t`Organization member not found`);
    }
    const organizationId = organizationMember.organizationId;
    const organization = Organizations.findOne(organizationId);
    if (!organization) {
      throw new Meteor.Error(404, t`Organization not found`);
    }

    const hasFullAccess = userHasFullAccessToOrganization(this.userId, organization);
    const isOwnMembership = organizationMember.userId === this.userId;
    const isAuthorized = hasFullAccess || isOwnMembership;
    if (!isAuthorized) {
      throw new Meteor.Error(403, t`Not authorized.`);
    }

    const isLastAdminMembership =
      AdministrativeRoles.includes(organizationMember.role) &&
      usersWithFullAccessToOrganizationCount(organization) === 1;
    if (isLastAdminMembership) {
      throw new Meteor.Error(403, t`Cannot revoke the membership of the last admin of an organization.`);
    }
    return OrganizationMembers.remove(_id);
  },
});
