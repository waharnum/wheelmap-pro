import { Meteor } from 'meteor/meteor';

import { isAdmin } from '../../../lib/is-admin';
import { publishPublicFields } from '../../../../server/publish';
import './publish-user-is-admin-flag.ts';

Meteor.publish('users.needApproval', function publish() {
  this.autorun(() => {
    if (!isAdmin(this.userId)) {
      return [];
    }
    return Meteor.users.find({ $or: [
      { isApproved: { $exists: false } },
      { isApproved: false },
    ] });
  });
});

publishPublicFields('users', Meteor.users);