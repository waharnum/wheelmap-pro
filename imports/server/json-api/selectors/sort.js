import { check, Match } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { ValidationError } from 'meteor/mdg:validation-error';
import pick from 'lodash/pick';
import some from 'lodash/some';

SimpleSchema.messages(
  { invalidFieldReference: '[label] should not contain non-allowed field name `[value]`.' },
);

// Returns MongoDB query options for given request

export function sortOptions(req, collection) {
  const sortQuery = pick(req.query, 'sort', 'descending');

  check(Object.keys(collection.publicFields), [String]);
  check(Object.values(collection.publicFields), [Match.OneOf(0, 1)]);
  const publicFieldNames = Object.keys(collection.publicFields);

  const schema = new SimpleSchema({
    descending: {
      type: Match.OneOf(Boolean, Number),
      optional: true,
    },
    sort: {
      type: String,
      optional: true,
      custom() {
        if (this.isSet && !some(publicFieldNames, n => n.split('.')[0] === n)) {
          throw new ValidationError(
            [
              {
                name: 'sort',
                type: 'invalidFieldReference',
                value: this.value,
              },
            ]
          );
        }
      },
    },
  });

  // Clean the data to remove whitespaces and have correct types
  schema.clean(sortQuery);

  // Throw ValidationError if something is wrong
  schema.validate(sortQuery);

  const options = sortQuery.sort ? {
    sort: { [sortQuery.sort]: (sortQuery.descending ? -1 : 1) },
  } : {};

  return Object.assign({}, options);
}
