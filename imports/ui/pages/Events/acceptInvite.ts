import { Meteor } from 'meteor/meteor';

interface IAcceptInviteParams {
  _id: Mongo.ObjectID;
  token: string;
}

export function acceptInvite(nextState) {
  const params = nextState.params as IAcceptInviteParams;
  Meteor.call('eventParticipants.acceptInvitation',
      { eventId: params._id, invitationToken: params.token },
      (error, result) => {
        if (error) {
          console.error('eventParticipants.acceptInvitation FAILED', error);
        } else {
          console.log('eventParticipants.acceptInvitation', result);
        }
      });
}
