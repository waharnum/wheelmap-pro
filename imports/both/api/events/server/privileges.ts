import {Events} from '../events';
import {userHasFullAccessToReferencedOrganization} from '../../organizations/privileges';

Events.allow({
  insert: userHasFullAccessToReferencedOrganization,
  update: userHasFullAccessToReferencedOrganization,
  remove: userHasFullAccessToReferencedOrganization,
});
