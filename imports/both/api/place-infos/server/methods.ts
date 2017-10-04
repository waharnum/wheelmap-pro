import {Meteor} from 'meteor/meteor';
import * as Fiber from 'fibers';

import pickRandomPlaceInfos from './pick-random-place-infos';
import {IPlaceInfo} from '../place-infos';

// This number is intentionally not very high even if a higher number of shown places would be more
// impressive. Less transferred map tile data means happier people with volume flat data plans :)
const CACHED_PLACE_INFO_COUNT = 25;

let cachedRandomPlaceInfos: IPlaceInfo[] = [];

Meteor.startup(() => {
  // Pick shown places in a new fiber to get faster Meteor restarts while developing
  Fiber(() => {
    cachedRandomPlaceInfos = pickRandomPlaceInfos(CACHED_PLACE_INFO_COUNT);
  }).run();
});

Meteor.methods({
  'PlaceInfos.getRandomPlaceInfos'() {
    this.unblock();
    return cachedRandomPlaceInfos || [];
  },
});
