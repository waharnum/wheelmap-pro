import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';
import {registerSchemaForI18n} from '../../i18n/i18n';
import {openForLabels} from './eventOpenFor';
import {eventStatusLabels} from './eventStatus';
import {EventRegion} from './events';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const defaultRegion: EventRegion = {
  topLeft: {latitude: 52.67551, longitude: 13.08835},
  bottomRight: {latitude: 52.33826, longitude: 13.76116},
};

export const EventSchema = new SimpleSchema({
  'organizationId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'name': {
    label: t`Name`,
    type: String,
    max: 1000,
    uniforms: {
      placeholder: t`e.g. Event title`,
    },
  },
  'description': {
    label: t`Description (optional)`,
    type: String,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. Healthcare places in…`,
    },
  },
  'regionName': {
    label: t`Region name`,
    type: String,
    max: 200,
    uniforms: {
      placeholder: t`e.g. Berlin Alexanderplatz`,
    },
  },
  'region': {
    type: Object,
    optional: true,
    uniforms: () => null,
    defaultValue: defaultRegion,
  },
  'region.topLeft': Object,
  'region.topLeft.latitude': {
    type: Number,
  },
  'region.topLeft.longitude': {
    type: Number,
  },
  'region.bottomRight': Object,
  'region.bottomRight.latitude': {
    type: Number,
  },
  'region.bottomRight.longitude': {
    type: Number,
  },
  'startTime': {
    label: t`Start Date and Time`,
    type: Date,
    optional: true,
  },
  'endTime': {
    label: t`End Date and Time`,
    type: Date,
    optional: true,
  },
  'webSiteUrl': {
    label: t`Website URL`,
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. http://www.example.com`,
    },
  },
  'photoUrl': {
    label: t`URL to a picture of the event`,
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. http://www.example.com/photo.jpg`,
    },
  },
  'invitationToken': {
    label: t`Invitation token`,
    type: String,
    max: 50,
    optional: true,
  },
  'verifyGpsPositionsOfEdits': {
    label: t`Verify GPS position of edits`,
    type: Boolean,
    defaultValue: false,
  },
  'targets': {
    type: Object,
    optional: true,
    defaultValue: {
      mappedPlacesCount: 0,
    },
  },
  'targets.mappedPlacesCount': {
    label: t`Goal for mapped places`,
    type: Number,
    optional: true,
  },
  'status': {
    type: String,
    allowedValues: eventStatusLabels.map((v) => v.value),
  },
  'openFor': {
    label: t`Open for…`,
    type: String,
    allowedValues: openForLabels.map((v) => v.value),
    uniforms: {
      options: openForLabels,
    },
  },
  'statistics': {
    optional: true,
    type: Object,
    defaultValue: {
      fullParticipantCount: 0,
      invitedParticipantCount: 0,
      draftParticipantCount: 0,
      acceptedParticipantCount: 0,
      mappedPlacesCount: 0,
    },
  },
  'statistics.fullParticipantCount': Number,
  'statistics.invitedParticipantCount': Number,
  'statistics.draftParticipantCount': Number,
  'statistics.acceptedParticipantCount': Number,
  'statistics.mappedPlacesCount': Number,

});

registerSchemaForI18n(EventSchema);
