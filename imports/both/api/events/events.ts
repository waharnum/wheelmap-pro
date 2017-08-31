import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { EventSchema } from './schema';

export interface IEvent {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  name: string;
  description?: string;
  regionName?: string;
  region?: {
    topLeft: { latitude: number, longitude: number },
    bottomRight: { latitude: number, longitude: number },
  },
  startTime?: Date;
  endTime?: Date;
  webSiteUrl?: string;
  photoUrl?: string;
  invitationToken?: string;
  verifyGpsPositionsOfEdits?: boolean;
  targets: {
    mappedPlacesCount?: number;
  }
  status: 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';
  visibility: 'inviteOnly' | 'public';
};

export const Events = new Mongo.Collection<IEvent>('Events');
Events.schema = EventSchema;
Events.attachSchema(Events.schema);
