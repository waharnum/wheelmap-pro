import {Meteor} from 'meteor/meteor';

// register organizations
import '../imports/both/api/organizations/server/publications';
import '../imports/both/api/organizations/server/indexing';
import '../imports/both/api/organizations/server/privileges';
import '../imports/both/api/organizations/server/methods';

// register organization members
import '../imports/both/api/organization-members/server/publications';
import '../imports/both/api/organization-members/server/indexing';
import '../imports/both/api/organization-members/server/privileges';
import '../imports/both/api/organization-members/server/methods';

// register users
import '../imports/both/api/users/server/publications';
import '../imports/both/api/users/server/methods';

// register events
import '../imports/both/api/events/server/publications';
import '../imports/both/api/events/server/indexing';
import '../imports/both/api/events/server/privileges';
import '../imports/both/api/events/server/methods';

// register event participants
import '../imports/both/api/event-participants/server/publications';
import '../imports/both/api/event-participants/server/indexing';
import '../imports/both/api/event-participants/server/privileges';
import '../imports/both/api/event-participants/server/methods';

// register sources
import '../imports/both/api/sources/server/publications';
import '../imports/both/api/sources/server/indexing';
import '../imports/both/api/sources/server/privileges';
import '../imports/both/api/sources/server/methods';

// configure account system
import '../imports/both/api/users/accounts';

// general security
import '../imports/server/security';
