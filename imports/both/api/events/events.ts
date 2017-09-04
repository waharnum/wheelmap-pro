import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { EventSchema } from './schema';
import { EventMixin, IEventMixin } from './mixins';

export type EventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';
export type EventVisibilityEnum = 'inviteOnly' | 'public';

export interface IEvent extends IEventMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  organizationId: Mongo.ObjectID;
  name: string;
  description?: string;
  regionName?: string;
  region?: {
    topLeft: { latitude: number, longitude: number },
    bottomRight: { latitude: number, longitude: number },
  };
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
  visibility: EventVisibilityEnum;
};

export const Events = new Mongo.Collection<IEvent & IEventMixin>('Events');
Events.schema = EventSchema;
Events.attachSchema(Events.schema);
Events.helpers(EventMixin);
