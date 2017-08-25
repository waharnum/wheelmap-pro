import { Licenses } from '../licenses.js';
import { publishPublicFields } from '/imports/server/publish';
import { publishPrivateFieldsForMembers } from '/imports/both/api/organizations/server/publications';

publishPublicFields('licenses', Licenses);
publishPrivateFieldsForMembers('licenses', Licenses);
