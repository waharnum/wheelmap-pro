import {Sources} from '../sources';
import {publishPrivateFieldsForMembers} from '../../organization-members/server/publishForMembers';
import {SourcePrivateFields} from './_fields';

// publishPublicFields('sources', Sources);
// publishPublicFields('sources.requestable', Sources, () => ({}), {}, {
//   isRequestable: true,
//   isDraft: false,
// });

publishPrivateFieldsForMembers('sources', Sources, SourcePrivateFields);
