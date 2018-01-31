import {Mongo} from 'meteor/mongo';

import {EventSchema} from './schema';
import {EventMixin, IEventMixin} from './mixins';
import {EventStatusEnum} from './eventStatus';
import {EventOpenForEnum} from './eventOpenFor';

export type EventRegion = {
  topLeft: { latitude: number; longitude: number };
  bottomRight: { latitude: number; longitude: number }
};

export interface IEventStatistics {
  fullParticipantCount: number;
  invitedParticipantCount: number;
  draftParticipantCount: number;
  acceptedParticipantCount: number;
  mappedPlacesCount: number;
}

export interface IEvent extends IEventMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  organizationId: Mongo.ObjectID;
  sourceId: Mongo.ObjectID;
  name: string;
  description?: string;
  regionName?: string;
  region?: EventRegion;
  startTime?: Date;
  endTime?: Date;
  webSiteUrl?: string;
  photoUrl?: string;
  invitationToken?: string;
  verifyGpsPositionsOfEdits?: boolean;
  targets?: {
    mappedPlacesCount?: number;
  };
  status: EventStatusEnum;
  openFor: EventOpenForEnum;
  statistics: IEventStatistics;
};

export const Events = new Mongo.Collection<IEvent & IEventMixin>('Events');
Events.schema = EventSchema;
Events.attachSchema(Events.schema);
Events.helpers(EventMixin);
