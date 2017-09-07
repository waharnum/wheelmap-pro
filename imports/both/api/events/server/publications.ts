import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Events } from '../events.js';
import { publishAndLog, publishFields} from '../../../../server/publish';
import {
  EventsPrivateFields,
  buildVisibleForPublicByEventIdSelector,
  buildVisibleForUserByEventIdSelector,
  buildVisibleForUserByOrganizationIdSelector } from './_fields';

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

publishFields('events.by_id.public',
  Events,
  EventsPrivateFields,
  buildVisibleForPublicByEventIdSelector,
);
