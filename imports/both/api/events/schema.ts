import SimpleSchema from 'simpl-schema';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const EventSchema = new SimpleSchema({
  'name': {
    label: 'Name',
    type: String,
    max: 1000,
    uniforms: {
      placeholder: 'e.g. Event title',
    },
  },
  'description': {
    label: 'Description (optional)',
    type: String,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. Our organization is…',
    },
  },
  'regionName': {
    label: 'Region name',
    type: String,
    max: 200,
    optional: true,
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
    label: 'Start Date and Time',
    type: Date,
    optional: true,
  },
  'endTime': {
    label: 'End Date and Time',
    type: Date,
    optional: true,
  },
  'webSiteUrl': {
    label: 'Website URL',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. http://www.example.com',
    },
  },
  'photoUrl': {
    label: 'URL to a picture of the event',
    type: String,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. http://www.example.com/photo.jpg',
    },
  },
  'invitationToken': {
    label: 'Invitation token',
    type: String,
    max: 50,
    optional: true,
  },
  'verifyGpsPositionsOfEdits': {
    type: Boolean,
    defaultValue: false,
  },
  'targets': {
    type: Object,
    optional: true,
  },
  'targets.mappedPlacesCount': {
    label: 'Goal for mapped places',
    type: Number,
    optional: true,
  },
  'status': {
    type: String,
    allowedValues: ['draft', 'planned', 'ongoing', 'completed', 'canceled'],
  },
  'visibility': {
    type: String,
    allowedValues: ['inviteOnly', 'public'],
  },
});
