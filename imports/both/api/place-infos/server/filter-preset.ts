import {pick} from 'lodash';
import SimpleSchema from 'simpl-schema';
import {FilterPresets} from '../../filter-presets/filter-presets';

interface IFieldsQuery {
  filter: string;
}

const FieldsSchema = new SimpleSchema({
  filter: {
    type: String,
    optional: true,
  },
});

// Returns MongoDB query options for given request

export function filterPresetSelector(req) {
  const fieldsQuery = pick(req.query, 'filter') as IFieldsQuery;

  // Clean the data to remove whitespaces and have correct types
  FieldsSchema.clean(fieldsQuery);

  // Throw ValidationError if something is wrong
  FieldsSchema.validate(fieldsQuery);

  if (fieldsQuery.filter) {
    const filter = FilterPresets.findOne(fieldsQuery.filter);
    if (!filter) {
      throw new Meteor.Error(404, 'No filter found for given ID.');
    }

    return filter.toSelector();
  }

  return {};
}
