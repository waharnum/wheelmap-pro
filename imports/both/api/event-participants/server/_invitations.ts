import {map} from 'lodash';
import {Email} from 'meteor/email';
import {Random} from 'meteor/random';
import {t} from 'c-3po';

import {IOrganization} from '../../organizations/organizations';
import {Events, IEvent} from '../../events/events';
import {getDisplayedNameForUser} from '../../../lib/user-name';
import {getGravatarHashForEmailAddress} from '../../../lib/user-icon';
import {EventParticipants, IEventParticipant} from '../event-participants';

const appName = 'wheelmap.pro';
const appSupportEmail = 'support@wheelmap.pro';

const invitationEmailBody = (userName: string,
                             organizationId: Mongo.ObjectID,
                             eventId: Mongo.ObjectID,
                             organizationName: string,
                             eventName: string, token: string) =>
  `Hi,

${userName} invites you to the event “${eventName}” by “${organizationName}” on ${appName}.

Use this link to sign up and join:

${Meteor.absoluteUrl(
    `organizations/${organizationId}/events/${eventId}/private-invitation/${token}`,
    {secure: true},
  )}

All the best,
Your ${appName} team.
`;

export function insertDraftEventParticipant(invitationEmailAddress: string, eventId: Mongo.ObjectID): IEventParticipant {

  const address = invitationEmailAddress.toLowerCase().trim();
  // find existing user via email
  const user = Meteor.users.findOne({emails: {$elemMatch: {address}}});

  const participant = {
    eventId,
    userId: user ? user._id : null, // empty if not existing when invited
    invitationToken: Random.secret(),
    invitationEmailAddress: address,
    invitationState: 'draft',
    gravatarHash: getGravatarHashForEmailAddress(invitationEmailAddress),
  } as IEventParticipant;

  const id = EventParticipants.insert(participant);
  return EventParticipants.findOne(id);
}

export function sendEventInvitationEmailTo(eventParticipant: IEventParticipant, event: IEvent, organization: IOrganization) {

  if (!event._id || !eventParticipant.invitationToken || !organization._id) {
    throw new Meteor.Error(400, 'Invalid data');
  }

  const emailAddress = eventParticipant.invitationEmailAddress;
  const token = eventParticipant.invitationToken;
  const organizationName = organization.name;
  const eventName = event.name;
  const userName = getDisplayedNameForUser(Meteor.user());

  const selector = {_id: eventParticipant._id};
  try {
    Email.send({
      from: appSupportEmail,
      to: emailAddress,
      subject: `${userName} invites you to access their organization “${organizationName}”`,
      text: invitationEmailBody(userName, organization._id, event._id, organizationName, eventName, token),
    });
    EventParticipants.update(selector, {$set: {invitationState: 'sent'}});
    return true;
  } catch (error) {
    console.log('sendInvitationEmailTo', error);

    EventParticipants.update(selector, {
      $set: {
        invitationState: 'error',
        invitationError: error.message,
      },
    });
    return false;
  }
}

function verifyEmailAddressIfPossible(userId: Mongo.ObjectID, participant: IEventParticipant) {

  const emailAddress = participant.invitationEmailAddress;
  if (!emailAddress) {
    throw new Meteor.Error(403, t`Email address in invitation is invalid`);
  }

  const user = Meteor.user();
  const addresses = map(user.emails, 'address');
  const index = addresses.indexOf(emailAddress);

  if (!user.emails) {
    throw new Meteor.Error(404, t`User ${userId} has no assigned emails.`);
  }

  if (index < 0) {
    console.log(`Can't use token for email verification, invitation went to '${emailAddress}'.`);
    console.log(`User's email addresses are ${JSON.stringify(map(user.emails, 'address'))}.`);
    return false;
  }

  if (user.emails[index].verified) {
    console.log(`Invitation email address '${emailAddress}' already verified`);
    return true;
  }

  console.log(`Verifying email address '${emailAddress}' via invitation token...`);
  Meteor.users.update({_id: userId}, {$set: {[`emails.${index}.verified`]: true}});
  return true;
}

function emailAddressIsUsersOrFree(address: string): 'free' | 'current' | 'in-use' {
  const user = Meteor.user();
  const addresses = map(user.emails, 'address');
  const index = addresses.indexOf(address);

  // one of the current users email addresses
  if (index >= 0) {
    return 'current';
  }

  // check if no one else is using this email
  const found = Meteor.users.find({emails: {$elemMatch: {address}}}, {limit: 1});
  return found.count() === 0 ? 'free' : 'in-use';
}

export function acceptEventInvitation(userId: Mongo.ObjectID, eventId: Mongo.ObjectID, token: string) {

  console.log(userId, 'tries to accept event invitation to', eventId, 'with token', token, '…');

  const pendingInvitation = EventParticipants.findOne(
    {eventId, invitationToken: token, invitationState: {$ne: 'accepted'}});
  if (!pendingInvitation || !pendingInvitation._id) {
    throw new Meteor.Error(404, t`No unaccepted invitation to ${eventId} found with token ${token}.`);
  }

  if (!pendingInvitation.invitationEmailAddress) {
    throw new Meteor.Error(403, t`Email address in invitation is invalid`);
  }

  // check if the email address used matches the current user or is unused
  const addressState = emailAddressIsUsersOrFree(pendingInvitation.invitationEmailAddress);
  if (addressState === 'in-use') {
    console.log('Email is already used by another user. Acceptance aborted.');
    throw new Meteor.Error(403, t`Email is already used by another user. Please sign with that email address.`);
  }

  const existingParticipation = EventParticipants.findOne({eventId, userId, invitationState: 'accepted'});
  if (existingParticipation) {
    EventParticipants.remove(pendingInvitation._id);
    console.log(
      `${userId} accepted invitation to ${eventId} using another email already. Deleted existing invitation.`);
    return existingParticipation;
  }

  if (addressState === 'free') {
    console.log(`Found new email address ${pendingInvitation.invitationEmailAddress} for user ${userId}, adding it.`);
    Meteor.users.update({_id: userId},
      {$push: {emails: {address: pendingInvitation.invitationEmailAddress, verified: true}}},
    );
  } else {
    verifyEmailAddressIfPossible(userId, pendingInvitation);
  }

  EventParticipants.update(
    {_id: pendingInvitation._id},
    {
      $set: {userId, invitationState: 'accepted'},
    },
  );

  const afterUpdate = EventParticipants.findOne(pendingInvitation._id);
  console.log(`${userId} now participant of ${eventId}`, 'as', afterUpdate);

  return pendingInvitation;
}

export function acceptPublicEventInvitation(userId: string, eventId: Mongo.ObjectID, token: string) {

  console.log(userId, 'tries to accept event invitation to', eventId, 'with token', token, '…');

  // find an event that matches the token and is not a draft
  const event = Events.findOne({_id: eventId, invitationToken: token, status: {$ne: 'draft'}});
  if (!event) {
    throw new Meteor.Error(404, t`No invitation in ${eventId} found with token ${token}.`);
  }

  const existingParticipation = EventParticipants.findOne({eventId, userId, invitationState: {$ne: 'accepted'}});
  if (existingParticipation && existingParticipation._id) {
    EventParticipants.update(existingParticipation._id, {
      $set: {
        invitationState: 'accepted',
      },
    });
    return existingParticipation;
  }

  EventParticipants.insert({
    eventId,
    userId,
    invitationState: 'accepted',
  } as IEventParticipant);
}
