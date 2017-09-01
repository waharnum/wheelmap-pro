import { Mongo } from 'meteor/mongo';

import { isAdmin } from '../../lib/is-admin';
import {
  isUserMemberOfOrganizationWithId,
  userHasFullAccessToOrganizationId,
  userHasFullAccessToReferencedOrganization,
} from '../organizations/privileges';

export interface IEventMixin {
  editableBy: (userId: Mongo.ObjectID) => boolean;
}

export const EventMixin = {
  editableBy(userId: Mongo.ObjectID): boolean {
    if (!userId) { return false; };
    return userHasFullAccessToReferencedOrganization(userId, this);
  },
} as IEventMixin;
