import { Meteor } from 'meteor/meteor';

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

// configure account system
import '../imports/both/api/users/accounts';

// general security
import '../imports/server/security';