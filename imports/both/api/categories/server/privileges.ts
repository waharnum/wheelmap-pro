import {isAdmin} from '../../../lib/is-admin';
import {Categories} from '../categories';

Categories.allow({
  insert: isAdmin,
  update: isAdmin,
  remove: isAdmin,
});

Categories.helpers({
  editableBy: isAdmin,
});
