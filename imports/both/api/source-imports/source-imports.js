import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import some from 'lodash/some';
import { Sources } from '/both/api/sources/sources';

export const SourceImports = new Mongo.Collection('SourceImports');

SourceImports.helpers({
  humanReadableStartTimestamp() {
    return moment(this.startTimestamp).format('DD.MM.YYYY HH:mm:ss');
  },
  agoStartTimestamp() {
    return moment(this.startTimestamp).fromNow();
  },
  hasError() {
    if (this.error) {
      return true;
    }
    if (!this.streamChain) return false;
    return some(this.streamChain, streamElement => streamElement.error);
  },
  getSource() {
    return Sources.findOne(this.sourceId);
  },
  hasRunningStreams() {
    if (!this.streamChain) return false;
    return some(this.streamChain, stream =>
      !stream || !stream.progress || !(stream.progress.isFinished || stream.progress.isAborted));
  },
  isAborted() {
    if (!this.streamChain) return false;
    return some(this.streamChain, stream =>
      stream && stream.progress && stream.progress.isAborted
    );
  },
  setUnfinishedStreamsToAborted() {
    const modifier = { $set: { } };
    this.streamChain.forEach((stream, index) => {
      if (!stream.progress || !stream.progress.isFinished) {
        modifier.$set[`streamChain.${index}.progress.isAborted`] = true;
        modifier.$set[`streamChain.${index}.progress.isFinished`] = false;
      }
    });
    const count = Object.keys(modifier.$set).length;
    console.log('Setting', count, 'streams to aborted for source import', this._id, '...');
    if (count) {
      SourceImports.update(this._id, modifier);
    }
  },
  upsertStream() {
    if (!this.streamChain) {
      return null;
    }
    return this.streamChain.find(stream => stream && stream.type === 'UpsertPlace');
  },
});
