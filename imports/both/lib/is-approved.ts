import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export function isApproved(userId) {
  // FIXME define approval status
  return true;
  // check(userId, String);
  // const user = Meteor.users.findOne(userId);
  // return user && user.isApproved;
}
