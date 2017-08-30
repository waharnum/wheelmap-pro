import { UserPublicFields } from './fields';
import { Meteor } from 'meteor/meteor';

import { isAdmin } from '../../../lib/is-admin';
import { publishAndLog, publishPublicFields } from '../../../../server/publish';
import './publish-user-is-admin-flag.ts';

publishAndLog('users.needApproval', () => {
  if (!isAdmin(this.userId)) {
    return [];
  }
  return Meteor.users.find({ $or: [
    { isApproved: { $exists: false } },
    { isApproved: false },
  ] });
});

// even though typescript complains about Meteor.users, this is fine. Kind of.
// It is unclear why the SimplSchema addition is not applied here
// TODO: check wether this publishes all the users?
publishPublicFields('users', Meteor.users, UserPublicFields);
