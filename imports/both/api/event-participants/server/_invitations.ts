import { map } from 'lodash';
import { Email } from 'meteor/email';
import { Random } from 'meteor/random';

import { IOrganization } from '../../organizations/organizations';
import { Events, IEvent } from '../../events/events';
import { getDisplayedNameForUser } from '../../../lib/user-name';
import { getGravatarHashForEmailAddress } from '../../../lib/user-icon';
import { EventParticipants, IEventParticipant } from '../event-participants';

const appName = 'wheelmap.pro';
const appSupportEmail = 'support@wheelmap.pro';

const invitationEmailBody = (userName: string, eventId: Mongo.ObjectID,
  organizationName: string, eventName: string, token: string) =>
`Hi,

${userName} invites you to the event “${eventName}” by “${organizationName}” on ${appName}.

Use this link to sign up and join:

${Meteor.absoluteUrl(
  `events/${eventId}/accept-invitation/${token}`,
  { secure: true },
)}

All the best,
Your ${appName} team.
`;

export function insertDraftEventParticipant(
  invitationEmailAddress: string, eventId: Mongo.ObjectID): IEventParticipant {

  const participant = {
    eventId,
    userId: null, // empty as not existing when invited
    invitationToken: Random.secret(),
    invitationEmailAddress: invitationEmailAddress.toLowerCase().trim(),
    invitationState: 'draft',
    gravatarHash: getGravatarHashForEmailAddress(invitationEmailAddress),
  } as IEventParticipant;

  const id = EventParticipants.insert(participant);
  return EventParticipants.findOne(id);
}

export function sendEventInvitationEmailTo(
  eventParticipant: IEventParticipant, event: IEvent, organization: IOrganization) {

  if (!event._id) {
    throw new Meteor.Error(400, 'Invalid data');
  }

  const emailAddress = eventParticipant.invitationEmailAddress;
  const token = eventParticipant.invitationToken;
  const organizationName = organization.name;
  const eventName = event.name;
  const userName = getDisplayedNameForUser(Meteor.user());

  const selector = { _id: eventParticipant._id };
  try {
    Email.send({
      from: appSupportEmail,
      to: emailAddress,
      subject: `${userName} invites you to access their organization “${organizationName}”`,
      text: invitationEmailBody(userName, event._id, organizationName, eventName, token),
    });
    EventParticipants.update(selector, { $set: { invitationState: 'sent' } });
    return true;
  } catch (error) {
    console.log('sendInvitationEmailTo', error);

    EventParticipants.update(selector, { $set: {
      invitationState: 'error',
      invitationError: error.message,
    } });
    return false;
  }
}

function verifyEmailAddressIfPossible(userId: Mongo.ObjectID, participant: IEventParticipant) {

  const emailAddress = participant.invitationEmailAddress;
  const user = Meteor.user();
  const addresses = map(user.emails, 'address');
  const index = addresses.indexOf(emailAddress);

  if (!user.emails) {
    throw new Meteor.Error(404, `User ${userId} has no assigned emails.`);
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
  Meteor.users.update({ _id: userId }, { $set: { [`emails.${index}.verified`]: true } });
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
  const found = Meteor.users.find({ emails: { $elemMatch: { address }}}, {limit: 1});
  return found.count() === 0 ? 'free' : 'in-use';
}

export function acceptEventInvitation(userId: Mongo.ObjectID, eventId: Mongo.ObjectID, token: string) {

  console.log(userId, 'tries to accept event invitation to', eventId, 'with token', token, '…');

  const participant = EventParticipants.findOne({ eventId, invitationToken: token });
  if (!participant || !participant._id) {
    throw new Meteor.Error(404, `No invitation found to ${eventId} with token ${token}.`);
  }

  if (EventParticipants.findOne({ eventId, userId })) {
    EventParticipants.remove(participant._id);
    console.log(`${userId} accepted invitation to ${eventId} using another email already. Deleted existing invitation.`);
    return participant;
  }

  // check if the email address used matches the current user or is unused
  const addressState = emailAddressIsUsersOrFree(participant.invitationEmailAddress);
  if (addressState === 'in-use') {
    console.log('Email is already used by another user. Acceptance aborted.');
    throw new Meteor.Error(403, 'Email is already used by another user. Please sign with that email address');
  }

  if (addressState === 'free' ) {
    console.log(`Found new email address ${participant.invitationEmailAddress} for user ${userId}, adding it.`);
    Meteor.users.update({ _id: userId },
      { $push: { emails: {address: participant.invitationEmailAddress, verified: true }}},
    );
  } else {
    verifyEmailAddressIfPossible(userId, participant);
  }

  EventParticipants.update(
    { _id: participant._id },
    {
      $set: { userId, invitationState: 'accepted' },
      $unset: { invitationToken: 1 },
    },
  );

  const afterUpdate = EventParticipants.findOne(participant._id);
  console.log(`${userId} now participant of ${eventId}`, 'as', afterUpdate);

  return participant;
}
