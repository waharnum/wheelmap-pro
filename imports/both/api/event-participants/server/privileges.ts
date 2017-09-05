import { Meteor } from 'meteor/meteor';

import { EventParticipants } from '../event-participants';
import { userHasFullAccessToReferencedOrganizationByMethod } from '../../organizations/privileges';

EventParticipants.allow({
  insert: userHasFullAccessToReferencedOrganizationByMethod,
  update: userHasFullAccessToReferencedOrganizationByMethod,
  remove: userHasFullAccessToReferencedOrganizationByMethod,
});

// Allow to remove your own organization memberships
EventParticipants.allow({
  remove(userId, organizationMember) {
    return organizationMember.userId === userId;
  },
});
