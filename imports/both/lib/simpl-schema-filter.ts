import SimpleSchema from 'simpl-schema';
import {pick} from 'lodash';

type FieldTree = { [key: string]: FieldTree };

/// Returns true if the given SimpleSchema definition contains a SimpleSchema instance
export const isDefinitionTypeSchema = (types: any[]): boolean => {
  // Check whether we need to handle multiple definitions
  if (types && SimpleSchema.isSimpleSchema(types[0].type)) {
    return true;
  }

  return false;
};

/// Returns true if the given SimpleSchema definition contains an array
export const isDefinitionTypeArray = (types: any[]): boolean => {
  // Check whether we need to handle multiple definitions
  if (types[0] && types[0].type === Array) {
    return true;
  }

  return false;
};

// picks the fields in the current schema and then extends with recursive calls to picks from subschema
const filterSchemaWithHierarchy = (schema: SimpleSchema, fieldTree: FieldTree) => {
  const currentLevelKeys = Object.keys(fieldTree);
  const pickKeys: Array<string> = [];
  const extendKeys: { [key: string]: SimpleSchema } = {};
  currentLevelKeys.forEach((key) => {
    const fieldDefinition = schema.getDefinition(key, ['type']);

    const hasChildren = Object.keys(fieldTree[key]).length > 0;
    // array
    if (hasChildren && isDefinitionTypeArray(fieldDefinition.type)) {
      const arrayKey = key + '.$';
      const hasArrayChildren = Object.keys(fieldTree[key]['$']).length > 0;
      const arrayFieldDefinition = schema.getDefinition(arrayKey, ['type']);
      // always add array itself
      pickKeys.push(key);
      // array of schema
      if (hasArrayChildren && isDefinitionTypeSchema(arrayFieldDefinition.type)) {
        // extend with array element type after picking
        extendKeys[arrayKey] = arrayFieldDefinition.type[0].type;
        fieldTree[arrayKey] = fieldTree[key]['$']; // ensure array can be found with the combined key
      } else {
        // add array element type
        pickKeys.push(arrayKey);
      }
    }
    // schema
    else if (hasChildren && isDefinitionTypeSchema(fieldDefinition.type)) {
      // extend after picking
      extendKeys[key] = fieldDefinition.type[0].type;
    }
    // regular key
    else {
      pickKeys.push(key);
    }
  });

  Object.keys(extendKeys).forEach((key) => {
    extendKeys[key] = filterSchemaWithHierarchy(extendKeys[key], fieldTree[key]);
  });

  const filteredSchema = schema.pick(...pickKeys);
  // we need to extend the sub schema manually, as this is not supported by SimpleSchema::pick
  filteredSchema.extend(extendKeys);

  return filteredSchema;
};

/**
 * Takes a list of hierarchical fields for a SimpleSchema and picks the matching fields into
 * a new SimpleSchema that will only include these, also ensuring child schema are filtered.
 *
 * @param {SimpleSchema} schema The schema to pick a hierarchical sub schema from
 * @param {Array<string>} fields A list of fields ['foo', 'foo.bar', 'foo.bar.$', 'foo.bar.$.baz']
 * @returns {SimpleSchema} The schema with the chosen fields.
 */
export const pickFields = (schema: SimpleSchema, fields: Array<string>) => {
  const expandedFields: FieldTree = {};

  fields.forEach((key) => {
    const parts = key.split('.');
    let root = expandedFields[parts[0]] = expandedFields[parts[0]] || {};
    for (let i = 1; i < parts.length; i++) {
      root = root[parts[i]] = root[parts[i]] || {};
    }
  });

  return filterSchemaWithHierarchy(schema, expandedFields);
};

/**
 * Takes a single for a SimpleSchema and picks the matching fields into
 * a new SimpleSchema that will only include these, also ensuring child schema are filtered.
 *
 * @param {SimpleSchema} schema The schema to pick a hierarchical sub schema from
 * @param {Array<string>} key a key to a part of the schema 'foo.bar.$.baz']
 * @returns {SimpleSchema} The schema with the chosen fields.
 */
export const pickFieldForAutoForm = (schema: SimpleSchema, key: string) => {
  return pickFields(schema, [key]);
};
