import {Events} from '../events.js';
import {publishFields} from '../../../../server/publish';
import {
  EventsPrivateFields,
  EventsPublicFields,
  buildVisibleForPublicByEventIdSelector,
  buildVisibleForUserByEventIdSelector,
  buildVisibleForUserByOrganizationIdSelector,
  buildVisibleForPublicByOrganizationIdSelector,
} from './_fields';

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
