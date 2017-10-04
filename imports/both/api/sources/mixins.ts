import {find} from 'lodash';
import {isAdmin} from '../../lib/is-admin';

import {Licenses} from '../../api/licenses/licenses';
import {IOrganization, Organizations} from '../organizations/organizations';
import {SourceImports} from '../../api/source-imports/source-imports';

import {isUserMemberOfOrganizationWithId} from '../organizations/privileges';
import {ISource} from './sources';

export interface ISourceMixin {
  isFullyVisibleForUserId: (userId) => boolean;
  isEditableBy: (userId) => boolean;
  hasRestrictedAccessForUserId: (userId) => boolean;
  isVisibleForUserId: (userId) => boolean;
  getOrganization: () => IOrganization;
  // TODO update after porting License type
  getLicense: () => any;
  inputMimeType: () => string | undefined;
  inputMimeTypeName: () => string;
  hasDownloadStep: () => boolean;
  // TODO update after porting SourceImport type
  getLastSuccessfulImport: () => any;
  // TODO update after porting SourceImport type
  getLastImportWithStats: () => any;
}

export const SourceMixin = {
  isFullyVisibleForUserId(userId) {
    return isAdmin(userId)
      || isUserMemberOfOrganizationWithId(userId, this.organizationId)
      || this.isFreelyAccessible;
  },
  isEditableBy(userId) {
    if (!userId) {
      return false;
    }
    return isAdmin(userId)
      || isUserMemberOfOrganizationWithId(userId, this.organizationId);
  },
  hasRestrictedAccessForUserId(userId) {
    const allowedOrganizationIDs = this.accessRestrictedTo || [];
    const userBelongsToAnAllowedOrganization = allowedOrganizationIDs.some(
      organizationId => isUserMemberOfOrganizationWithId(userId, organizationId),
    );

    return !this.isFreelyAccessible && userBelongsToAnAllowedOrganization;
  },
  isVisibleForUserId(userId) {
    return this.isFullyVisibleForUserId(userId) || this.hasRestrictedAccessForUserId(userId);
  },
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
  getLicense() {
    return Licenses.findOne(this.licenseId);
  },
  inputMimeType() {
    const source = this as ISource;
    const downloadItem = find(source.streamChain, chainItem => chainItem.type === 'HTTPDownload');
    return (downloadItem && downloadItem.parameters && downloadItem.parameters.inputMimeType);
  },
  inputMimeTypeName() {
    switch (this.inputMimeType()) {
      case 'application/json':
        return 'JSON';
      case 'text/csv':
        return 'CSV';
      default:
        return '(Unknown format)';
    }
  },
  hasDownloadStep() {
    // This should be using SimpleSchema validators on all mappings steps to validate the mappings.
    if (!this.streamChain) {
      return false;
    }
    const hasDownloadStep = !!this.streamChain.find((step) =>
      step.type === 'HTTPDownload' && !!step.parameters.sourceUrl);
    return hasDownloadStep;
  },
  getLastSuccessfulImport() {
    return SourceImports
      .find({sourceId: this._id, isFinished: true}, {sort: {startTimestamp: -1}})
      .fetch()
      .find(i => (!i.hasError() && !i.isAborted()));
  },
  getLastImportWithStats() {
    return SourceImports
      .find({sourceId: this._id, isFinished: true}, {sort: {startTimestamp: -1}})
      .fetch()
      .find(i => Boolean(i.attributeDistribution));
  },
} as ISourceMixin;
