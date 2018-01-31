import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';

import {Organizations} from '../organizations/organizations';
import {userHasFullAccessToOrganizationId} from '../organizations/privileges';

import {LicenseSchema} from './schema';
import {isAdmin} from '../../lib/is-admin';

export interface ILicense {
  _id?: Mongo.ObjectID;
  organizationId: Mongo.ObjectID;
  name: string;
  shortName?: string;
  websiteURL?: string;
  fullTextURL?: string;
  plainTextSummary?: string;
  consideredAs: 'CC0' | 'CCBY' | 'CCSA' | 'restricted';
};


export const Licenses = new Mongo.Collection<ILicense>('Licenses');

Licenses.attachSchema(LicenseSchema);

Licenses.helpers({
  editableBy(userId) {
    if (!userId) return false;
    check(userId, String);
    return isAdmin(userId) || userHasFullAccessToOrganizationId(userId, this.organizationId);
  },
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
});
