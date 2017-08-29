import { Organizations } from '../organizations';
import { userHasFullAccessToOrganization } from '../privileges';

Organizations.allow({
  insert: userHasFullAccessToOrganization,
  update: userHasFullAccessToOrganization,
  remove: userHasFullAccessToOrganization,
});

// Organizations.publicFields = {
//   name: 1,
//   address: 1,
//   addressAdditional: 1,
//   zipCode: 1,
//   city: 1,
//   country: 1,
//   phoneNumber: 1,
//   webSite: 1,
//   logo: 1,
//   description: 1,
//   tocForOrganizationsAccepted: 1,
// };

// Organizations.visibleSelectorForUserId = () => ({});
// Organizations.visibleSelectorForAppId = () => ({});
