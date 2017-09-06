import {Meteor} from 'meteor/meteor';

import { EventParticipants } from '../event-participants';
import { publishAndLog, publishFields } from '../../../../server/publish';
import { EventParticipationPublicFields, buildVisibleForUserByEventIdSelector } from './_fields';

publishFields('eventParticipants.by_eventId',
  EventParticipants,
  EventParticipationPublicFields,
  buildVisibleForUserByEventIdSelector,
);
