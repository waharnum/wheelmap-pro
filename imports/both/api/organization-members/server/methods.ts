import {Meteor} from 'meteor/meteor';
import {Organizations} from '../../organizations/organizations';
import {userHasFullAccessToOrganization} from '../../organizations/privileges';
import {OrganizationMembers} from '../organization-members';
import { t } from 'c-3po';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {acceptInvitation, inviteUserToOrganization} from './invitations';

export const insert = new ValidatedMethod({
  name: 'organizationMembers.invite',
  validate: OrganizationMembers.schema.pick('invitationEmailAddress', 'organizationId').validator(),
  run({invitationEmailAddress, organizationId}) {
    console.log('Inviting', invitationEmailAddress, 'to', organizationId, '...');

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

    return inviteUserToOrganization(invitationEmailAddress, organizationId, 'member');
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

    const isLastMembership = OrganizationMembers.find({organizationId}).count() === 1;
    if (isLastMembership) {
      throw new Meteor.Error(403, t`Cannot revoke last organization membership.`);
    }
    return OrganizationMembers.remove(_id);
  },
});
