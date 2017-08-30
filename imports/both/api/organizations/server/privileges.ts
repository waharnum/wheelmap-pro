import { Organizations } from '../organizations';
import { userHasFullAccessToOrganization } from '../privileges';

Organizations.allow({
  insert: userHasFullAccessToOrganization,
  update: userHasFullAccessToOrganization,
  remove: userHasFullAccessToOrganization,
});
