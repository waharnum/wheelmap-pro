import {Events} from '../events.js';
import {publishFields} from '../../../../server/publish';
import {
  EventsPrivateFields,
  EventsPublicFields,
  buildVisibleForPublicByEventIdSelector,
  buildVisibleForUserByEventIdSelector,
  buildVisibleForUserByOrganizationIdSelector,
  buildVisibleForPublicByOrganizationIdSelector, buildStatisticsVisibleForPublicByEventIdSelector,
} from './_fields';
import {EventStatistics} from '../events';

publishFields('events.by_id.private',
  Events,
  EventsPrivateFields,
  buildVisibleForUserByEventIdSelector,
);

publishFields('events.by_organizationId.private',
  Events,
  EventsPrivateFields,
  buildVisibleForUserByOrganizationIdSelector,
);

publishFields('events.by_organizationId.public',
  Events,
  EventsPublicFields,
  buildVisibleForPublicByOrganizationIdSelector,
);

publishFields('events.by_id.public',
  Events,
  EventsPublicFields,
  buildVisibleForPublicByEventIdSelector,
);

publishFields('eventStatistics.by_eventId.public',
  EventStatistics,
  {},
  buildStatisticsVisibleForPublicByEventIdSelector,
);
