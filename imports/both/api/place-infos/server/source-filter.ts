import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import {pick} from 'lodash';

// Returns MongoDB query options for given request

interface FieldsQuery {
  includeSourceIds?: string;
  excludeSourceIds?: string;
}

const FieldsQuerySchema = new SimpleSchema({
  includeSourceIds: {
    type: String,
    optional: true,
  },
  excludeSourceIds: {
    type: String,
    optional: true,
  },
});


export function sourceFilterSelector(req) {
  const fieldsQuery = pick(req.query, 'includeSourceIds', 'excludeSourceIds') as FieldsQuery;

  // Clean the data to remove whitespaces and have correct types
  FieldsQuerySchema.clean(fieldsQuery);

  // Throw ValidationError if something is wrong
  FieldsQuerySchema.validate(fieldsQuery);

  if (fieldsQuery.includeSourceIds && fieldsQuery.excludeSourceIds) {
    throw new Meteor.Error(422,
      'You cannot use both `includeSourceIds` and `excludeSourceIds` parameters at the same time.',
    );
  }

  if (fieldsQuery.includeSourceIds) {
    return {'properties.sourceId': {$in: fieldsQuery.includeSourceIds.split(',')}};
  }

  if (fieldsQuery.excludeSourceIds) {
    return {'properties.sourceId': {$nin: fieldsQuery.excludeSourceIds.split(',')}};
  }

  return {};
}
