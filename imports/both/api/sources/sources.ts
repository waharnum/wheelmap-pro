import {Mongo} from 'meteor/mongo';

import {Licenses} from '../../api/licenses/licenses';

import {ISourceMixin, SourceMixin} from './mixins';
import {SourcesSchema} from './schema';

export interface ISource extends ISourceMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields

  organizationId: Mongo.ObjectID;
  name: string;
  shortName: string;
  licenseId: Mongo.ObjectID;
  description?: string;
  originWebsiteURL?: string;
  'translations.additionalAccessibilityInformation.en_US'?: string;
  isDraft?: boolean;
  streamChain: Array<{ parameters: Array<any & { inputMimeType }>, type: string } & any>;
  isFreelyAccessible: boolean;
  isRequestable: boolean;
  accessRestrictedTo: string[];
  hasRunningImport?: boolean;
  placeInfoCount: number;
  isShownOnStartPage?: boolean;
};

export const Sources = new Mongo.Collection<ISource>('Sources');


Sources.schema = SourcesSchema;
Sources.attachSchema(SourcesSchema);

Sources.helpers(SourceMixin);

export const SourcesRelationships = {
  belongsTo: {
    license: {
      foreignCollection: Licenses,
      foreignKey: 'licenseId',
    },
  },
};


