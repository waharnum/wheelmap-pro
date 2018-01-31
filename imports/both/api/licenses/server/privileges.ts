import {userHasFullAccessToReferencedOrganization} from '../../organizations/privileges';
import {Licenses} from '../licenses';

Licenses.allow({
  insert: userHasFullAccessToReferencedOrganization,
  update: userHasFullAccessToReferencedOrganization,
  remove: userHasFullAccessToReferencedOrganization,
});

const LicensesVisibleSelectorForUserId = () => ({});
