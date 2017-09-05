import { Meteor } from 'meteor/meteor';

import { EventParticipants } from '../event-participants';
import { publishAndLog } from '../../../../server/publish';

publishAndLog('eventParticipants.remove_me', () => {
  return EventParticipants.find();
});
