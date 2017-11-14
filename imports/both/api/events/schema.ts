import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';
import {registerSchemaForI18n} from '../../i18n/i18n';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

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
  },
  'targets.mappedPlacesCount': {
    label: t`Goal for mapped places`,
    type: Number,
    optional: true,
  },
  'status': {
    type: String,
    allowedValues: ['draft', 'planned', 'ongoing', 'completed', 'canceled'],
  },
  'openFor': {
    label: t`Open for…`,
    type: String,
    allowedValues: ['inviteOnly', 'everybody'],
    uniforms: {
      options: [
        {label: t`Invite Only`, value: 'inviteOnly'},
        {label: t`Everybody`, value: 'everybody'},
      ],
    },
  },
  'statistics': {
    optional: true,
    type: Object,
  },
  'statistics.fullParticipantCount': Number,
  'statistics.acceptedParticipantCount': Number,
  'statistics.mappedPlacesCount': Number,
});

registerSchemaForI18n(EventSchema);
