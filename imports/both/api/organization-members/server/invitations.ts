import {RoleType} from '../roles';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {map} from 'lodash';
import {Random} from 'meteor/random';
import {Email} from 'meteor/email';
import {check} from 'meteor/check';
import {t} from 'c-3po';

import {Organizations} from '../../organizations/organizations';
import {getDisplayedNameForUser} from '../../../lib/user-name';
import {getGravatarHashForEmailAddress} from '../../../lib/user-icon';
import {IOrganizationMember, OrganizationMembers} from '../organization-members';

const appName = 'wheelmap.pro';
const appSupportEmail = 'support@wheelmap.pro';

const invitationEmailBody = ({userName, organizationId, organizationName, token}) =>
  `Hi,

${userName} invites you to their organization “${organizationName}” on ${appName},
an app that collects accessibility information about places.

Use this link to sign up and get access:

${Meteor.absoluteUrl(
    `organizations/${organizationId}/accept-invitation/${token}`,
    {secure: true},
  )}

All the best,
Your ${appName} team.
`;

function insertPlaceholderMembership(options) {
  const member = {
    organizationId: options.organizationId,
    userId: null, // empty as not existing when invited
    invitationToken: options.token,
    invitationEmailAddress: options.emailAddress,
    role: options.role,
    invitationState: 'queuedForSending',
    gravatarHash: getGravatarHashForEmailAddress(options.emailAddress),
  };

  console.log('Placeholder member:', member);

  const id = OrganizationMembers.insert(member as IOrganizationMember);
  return OrganizationMembers.findOne(id);
}

function sendInvitationEmailTo(userEmailAddress: string, organizationId: Mongo.ObjectID, role) {
  check(userEmailAddress, String);
  check(organizationId, String);
  check(role, String);
  const emailAddress = userEmailAddress.toLowerCase().trim();
  const organization = Organizations.findOne({_id: organizationId});
  const token = Random.secret();
  const organizationName = organization.name;
  const member = insertPlaceholderMembership({emailAddress, organizationId, token, role});
  const userName = getDisplayedNameForUser(Meteor.user());
  const selector = {_id: member._id};
  try {
    Email.send({
      from: appSupportEmail,
      to: emailAddress,
      subject: `${userName} invites you to access their organization “${organizationName}”`,
      text: invitationEmailBody({userName, organizationName, organizationId, token}),
    });

    OrganizationMembers.update(selector, {$set: {invitationState: 'sent'}});
  } catch (error) {
    OrganizationMembers.update(selector, {
      $set: {
        invitationState: 'error',
        invitationError: error,
      },
    });
  }

  return member;
}

function useTokenToVerifyEmailAddressIfPossible(userId: Mongo.ObjectID, memberId: Mongo.ObjectID, token) {
  check(userId, String);
  check(memberId, String);
  check(token, String);
  console.log('Trying to use invitation token to verify email address...');
  const member = OrganizationMembers.findOne({_id: memberId, invitationToken: token});
  if (!member) {
    throw new Meteor.Error(404, `No member with id ${memberId} existing.`);
  }

  const emailAddress = member.invitationEmailAddress;
  if (!emailAddress) {
    throw new Meteor.Error(404, `No member with email ${emailAddress} existing.`);
  }

  const user = Meteor.user();
  const addresses = map(user.emails, 'address');
  const index = addresses.indexOf(emailAddress);

  if (index < 0) {
    console.log(`Can't use token for email verification, invitation went to '${emailAddress}'.`);
    console.log(`User's email addresses are ${JSON.stringify(map(user.emails, 'address'))}.`);
    return false;
  }

  if (!user.emails) {
    throw new Meteor.Error(404, `User ${user._id} has mp assigned emails.`);
  }

  if (user.emails[index].verified) {
    console.log(`Invitation email address '${emailAddress}' already verified`);
    console.log('do not re-verify it via invitation token.');
    return true;
  }

  console.log('Verifying email address \'${emailAddress}\' via invitation token...');
  Meteor.users.update({_id: userId}, {$set: {[`emails.${index}.verified`]: true}});
  return true;
}

export function inviteUserToOrganization(emailAddress: string, organizationId: Mongo.ObjectID, role: RoleType) {
  const invitationEmailAddress = emailAddress.toLowerCase().trim();

  console.log(`Inviting ${emailAddress} to organization ${organizationId}...`);

  let member = OrganizationMembers.findOne({organizationId, invitationEmailAddress});

  if (member) {
    console.log(`${invitationEmailAddress} already invited.`);
    return member;
  }

  const addressRegExp = invitationEmailAddress.replace(/([^a-zA-Z0-9])/g, '\\$1');
  const user = Meteor.users.findOne(
    {'emails.address': {$regex: addressRegExp, $options: 'i'}},
  );

  if (user && user._id) {
    const userId = user._id;

    console.log(
      `${invitationEmailAddress} already registered (${userId}), adding a member if necessary…`,
    );
    member = OrganizationMembers.findOne({userId, organizationId});
    if (member) {
      console.log(`${invitationEmailAddress} is already in organization ${organizationId}.`);
      return member;
    }
    const memberId = OrganizationMembers.insert({
      userId,
      organizationId,
      role,
      invitationState: 'accepted',
    } as IOrganizationMember);
    console.log(`Inserted member ${memberId}.`);
    return OrganizationMembers.findOne(memberId);
  }

  console.log(`${invitationEmailAddress} no user of our app yet, sending invitation...`);

  member = sendInvitationEmailTo(invitationEmailAddress, organizationId, role);
  return member;
}

export function acceptInvitation(userId: Mongo.ObjectID, organizationId: Mongo.ObjectID, token) {
  check(userId, String);
  check(organizationId, String);
  check(token, String);

  console.log(userId, 'accepts invitation to', organizationId, 'with token', token, '…');

  const member = OrganizationMembers.findOne({organizationId, invitationToken: token});

  if (!member || !member._id) {
    console.log(`No invitation found to ${organizationId} with token ${token}.`);
    return null;
  }

  if (OrganizationMembers.findOne({organizationId, userId})) {
    OrganizationMembers.remove(member._id);
    console.log(`${userId} accepted invitation to ${organizationId} already.`);
    console.log('Deleted existing invitation.');
    return member;
  }

  useTokenToVerifyEmailAddressIfPossible(userId, member._id, token);

  OrganizationMembers.update(
    {_id: member._id},
    {
      $set: {userId, invitationState: 'accepted'},
      $unset: {invitationToken: 1},
    },
  );

  const memberAfterUpdate = OrganizationMembers.findOne(member._id);
  console.log(`${userId} now member of ${organizationId}`, 'as', memberAfterUpdate);

  return member;
}
