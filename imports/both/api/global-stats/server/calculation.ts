import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

import {Sources} from '../../sources/sources';
import {PlaceInfos} from '../../place-infos/place-infos';
import {GlobalStats} from '../global-stats';
import {Organizations} from '../../organizations/organizations';

type StatisticsInput = { collection: Mongo.Collection<any>, countName?: string, selector?: Mongo.Selector };

export function saveCount(statsCollection: Mongo.Collection<any>, {collection, countName, selector = {}}: StatisticsInput) {
  const value = collection.find(selector).count();
  const name = `${collection._name}${countName ? `.${countName}` : ''}.count`;
  statsCollection.insert({name, date: new Date(), value});
  console.log(`${value} ${collection._name} in total.`);
}

function saveGlobalCount(options: StatisticsInput) {
  saveCount(GlobalStats, options);
}

export function calculateGlobalStats() {
  const sourceIdsWithoutDrafts = Sources
    .find({isDraft: false}, {fields: {_id: 1}})
    .fetch()
    .map(source => source._id);

  const globalData: Array<StatisticsInput> = [
    {collection: Meteor.users as Mongo.Collection<Meteor.User>},
    {collection: PlaceInfos},
    {collection: Sources},
    {collection: Organizations},
    {
      collection: PlaceInfos,
      countName: 'withoutDrafts',
      selector: {'properties.sourceId': {$in: sourceIdsWithoutDrafts}},
    },
    {
      collection: Sources,
      countName: 'withoutDrafts',
      selector: {isDraft: false},
    },
  ];

  globalData.forEach(saveGlobalCount);
}
