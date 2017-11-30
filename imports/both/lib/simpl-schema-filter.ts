import SimpleSchema from 'simpl-schema';

import {transform, isEqual, extend} from 'lodash';

type FilterOptions = {
  stripAccessibilityFromDefinition?: boolean,
  ensureExistingParentArrayAndObjects?: boolean,
  forceNonOptionalLeaf?: Array<string>,
};

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
const filterSchemaWithHierarchy = (schema: SimpleSchema, fieldTree: FieldTree, options: FilterOptions, path: Array<string>) => {
  const currentLevelKeys = Object.keys(fieldTree);
  const pickKeys: Array<string> = [];
  const extendKeys: { [key: string]: SimpleSchema } = {};
  const extensions: { [key: string]: Partial<SchemaDefinition> } = {};


  currentLevelKeys.forEach((key) => {
    const fieldDefinition = schema.getDefinition(key, ['type']);
    const currentPath = path.concat([key]);
    const hasChildren = Object.keys(fieldTree[key]).length > 0;
    // array
    if (hasChildren && isDefinitionTypeArray(fieldDefinition.type)) {
      const arrayKey = key + '.$';
      const hasArrayChildren = Object.keys(fieldTree[key]['$']).length > 0;
      const arrayFieldDefinition = schema.getDefinition(arrayKey, ['type']);
      // always add array itself
      pickKeys.push(key);

      if (options.ensureExistingParentArrayAndObjects) {
        extensions[key] = extend(extensions[key] || {}, {
          autoValue: function () {
            if (!this.isSet) {
              return [];
            }
          },
        });
      }

      // array of schema
      if (hasArrayChildren && isDefinitionTypeSchema(arrayFieldDefinition.type)) {

        if (options.ensureExistingParentArrayAndObjects) {
          extensions[arrayKey] = extend(extensions[arrayKey] || {}, {
            autoValue: function () {
              if (!this.isSet) {
                return {};
              }
            },
          });
        }
        // extend with array element type after picking
        extendKeys[arrayKey] = arrayFieldDefinition.type[0].type as SimpleSchema;
        fieldTree[arrayKey] = fieldTree[key]['$']; // ensure array can be found with the combined key
      } else {
        // add array element type
        pickKeys.push(arrayKey);
      }
    }
    // schema
    else if (hasChildren && isDefinitionTypeSchema(fieldDefinition.type)) {
      // extend after picking
      extendKeys[key] = fieldDefinition.type[0].type as SimpleSchema;
    }
    // regular key
    else {
      pickKeys.push(key);
    }

    if (options.forceNonOptionalLeaf && isEqual(options.forceNonOptionalLeaf, currentPath)) {
      extensions[key] = extend(extensions[key] || {}, {
        optional: false,
      });
    }
  });

  Object.keys(extendKeys).forEach((key) => {
    extendKeys[key] = filterSchemaWithHierarchy(
      extendKeys[key],
      fieldTree[key],
      options,
      path.concat(key.split('.')));
  });

  const filteredSchema = schema.pick(...pickKeys);
  // we need to extend the sub schema manually, as this is not supported by SimpleSchema::pick
  transform(extendKeys, (result, value, key) => {
    result[key] = extend(result[key] || {}, {
      type: value,
    });

    if (options.ensureExistingParentArrayAndObjects) {
      result[key].autoValue = function () {
        if (!this.isSet) {
          return {};
        }
      };
    }
  }, extensions);

  filteredSchema.extend(extensions);
  // delete accessibility manually, uniforms cannot handle this, and there is no way to un-extend a schema
  if (options.stripAccessibilityFromDefinition) {
    pickKeys.forEach((key) => {
      delete (filteredSchema as any)._schema[key].accessibility;
    });
  }

  return filteredSchema;
};

/**
 * Takes a list of hierarchical fields for a SimpleSchema and picks the matching fields into
 * a new SimpleSchema that will only include these, also ensuring child schema are filtered.
 *
 * @param {SimpleSchema} schema The schema to pick a hierarchical sub schema from
 * @param {Array<string>} fields A list of fields ['foo', 'foo.bar', 'foo.bar.$', 'foo.bar.$.baz']
 * @param options The additional options when filtering
 * @returns {SimpleSchema} The schema with the chosen fields.
 */
export const pickFields = (schema: SimpleSchema, fields: Array<string>, options: FilterOptions = {}) => {
  const expandedFields: FieldTree = {};

  // build the field tree
  fields.forEach((key) => {
    const parts = key.split('.');
    let root = expandedFields[parts[0]] = expandedFields[parts[0]] || {};
    for (let i = 1; i < parts.length; i++) {
      root = root[parts[i]] = root[parts[i]] || {};
    }
  });

  return filterSchemaWithHierarchy(schema, expandedFields, options, []);
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
  return pickFields(schema, [key], {
    stripAccessibilityFromDefinition: true,
    ensureExistingParentArrayAndObjects: true,
    forceNonOptionalLeaf: key.split('.'),
  });
};
