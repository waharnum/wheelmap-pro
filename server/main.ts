import { Meteor } from 'meteor/meteor';

import '../imports/both/api/organizations/server/publications';
import '../imports/both/api/organizations/server/indexing';
import '../imports/both/api/organizations/server/privileges';
import '../imports/both/api/organizations/server/methods';

// import '../imports/both/api/organization-members/server/publications';
// import '../imports/both/api/organization-members/server/indexing';
// import '../imports/both/api/organization-members/server/privileges';
// import '../imports/both/api/organization-members/server/methods';

import '../imports/server/publish-user-is-admin-flag';

import '../imports/server/security';

import '../imports/both/api/users/accounts';
