import {EventParticipants} from '../event-participants';
import {publishFields} from '../../../../server/publish';
import {
  buildByEventIdForCurrentUserSelector,
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


publishFields('eventParticipants.my_byEventId.private',
  EventParticipants,
  EventParticipationPrivateFields,
  buildByEventIdForCurrentUserSelector,
);
