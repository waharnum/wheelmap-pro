import { Sources } from '../sources.js';
import { publishPublicFields } from '/imports/server/publish';
import { publishPrivateFieldsForMembers } from '/imports/both/api/organizations/server/publications';

publishPublicFields('sources', Sources);
publishPublicFields('sources.requestable', Sources, () => ({}), {}, {
  isRequestable: true,
  isDraft: false,
});
publishPrivateFieldsForMembers('sources', Sources);
