import {Meteor} from 'meteor/meteor';

import { EventParticipants } from '../event-participants';
import { publishAndLog, publishFields } from '../../../../server/publish';
import {
  buildByEventIdAndTokenSelector,
  buildVisibleForUserByEventIdSelector,
  EventParticipationPrivateFields,
  EventParticipationPublicFields,
} from './_fields';

publishFields('eventParticipants.by_eventId.private',
  EventParticipants,
  EventParticipationPrivateFields,
  buildVisibleForUserByEventIdSelector,
);

publishFields('eventParticipants.by_eventIdAndToken.public',
  EventParticipants,
  EventParticipationPublicFields,
  buildByEventIdAndTokenSelector,
);
