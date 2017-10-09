import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export interface IPlaceInfo {
  _id: Mongo.ObjectID;
  properties: {
    infoPageUrl: string;
    originalId: string;
    category: string;
    name: string;
    address: string;
    originalData: any;
    sourceId: Mongo.ObjectID;
    sourceImportId: Mongo.ObjectID;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  }
}

export const PlaceInfos = new Mongo.Collection<IPlaceInfo>('PlaceInfos');