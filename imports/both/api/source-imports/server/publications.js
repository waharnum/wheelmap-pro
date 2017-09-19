import util from 'util';
import {Meteor} from 'meteor/meteor';
import {Sources} from '/imports/both/api/sources/sources';
import {check} from 'meteor/check';
import {SourceImports} from '../source-imports.js';
import {publishPublicFields} from '/imports/server/publish';
import {publishPrivateFieldsForMembers} from '/imports/both/api/organizations/server/publications';

publishPublicFields('sourceImports', SourceImports);
publishPrivateFieldsForMembers('sourceImports', SourceImports);

Meteor.publish('sourceImports.stats.public', function publish(sourceId) {
  check(sourceId, String);
  this.autorun(function () {
    // do not convert into arrow function, otherwise this gets replaced
    const source = Sources.findOne(sourceId);
    if (!source) {
      return [];
    }

    const visibleSelector = SourceImports.visibleSelectorForUserId(this.userId);

    let selector;
    if (source.isFreelyAccessible) {
      selector = {sourceId};
    } else {
      selector = {$and: [visibleSelector, {sourceId}]};
    }

    return SourceImports.find(
      selector,
      {fields: SourceImports.statsFields}
    );
  });
});
