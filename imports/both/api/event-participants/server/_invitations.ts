import { Random } from 'meteor/random';
import { Email } from 'meteor/email';

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

export function insertDraftParticipant(invitationEmailAddress: string, eventId: Mongo.ObjectID): IEventParticipant {
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

export function sendInvitationEmailTo(eventParticipant: IEventParticipant, event: IEvent, organization: IOrganization) {

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
