import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

// Returns MongoDB query options for given request

export function paginationOptions(req) {
  const paginationQuery = pick(req.query, 'skip', 'limit');

  const schema = new SimpleSchema({
    skip: {
      type: Number,
      min: 0,
      optional: true,
    },
    limit: {
      type: Number,
      min: 0,
      max: 150000,
      optional: true,
      defaultValue: 1000,
    },
  });

  // Clean the data to remove whitespaces and have correct types
  schema.clean(paginationQuery);

  // Throw ValidationError if something is wrong
  schema.validate(paginationQuery);

  return Object.assign({}, paginationQuery);
}
