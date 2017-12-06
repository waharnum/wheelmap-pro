import SimpleSchema from 'simpl-schema';
import {assign, update} from 'lodash';
import {
  AccessibilitySchemaExtension, LengthQuantitySchema, PlaceInfoSchema, PlacePropertiesSchema,
  PointGeometrySchema,
} from '@sozialhelden/ac-format';

SimpleSchema.extendOptions(['uniforms']);

import {isDefinitionTypeArray, isDefinitionTypeSchema} from './simpl-schema-filter';
import YesNoQuestion from '../../ui/components/Questionaire/YesNoQuestion';
import PlaceOnMapQuestion from '../../ui/components/Questionaire/PlaceOnMapQuestion';
import ChooseCategoryQuestion from '../../ui/components/Questionaire/ChooseCategoryQuestion';
import UnitQuantityQuestion from '../../ui/components/Questionaire/UnitQuantityQuestion';

const hashSchema = (schema: SimpleSchema): string | null => {
  if (!schema || !SimpleSchema.isSimpleSchema(schema)) {
    return null;
  }

  if ((schema as any).__hash) {
    return (schema as any).__hash;
  }

  const keys = schema.objectKeys();
  const hash = keys.reduce((result, key) => {
    let type: string | null = String(schema.getQuickTypeForKey(key));
    if (!type) {
      type = hashSchema(schema.schema(key).definitions[0].type);
    }
    return `${result}-${key}:${type}`;
  }, '');
  (schema as any).__hash = hash;
  return hash;
};

const assignUpdate = (object: {}, path: string | string[], value: {}) => {
  update(object, path, (orig) => orig ? assign(orig, value) : value);
};

export const isEqualSchema = (left: SimpleSchema, right: SimpleSchema) => {
  // as schema instances are wildly different and get duplicated all the time, we hash their keys&types and go with that
  return hashSchema(left) === hashSchema(right);
};

const definitionHasSchema = (typeDefinition: SchemaDefinition, schema: SimpleSchema) => {
  const type = typeDefinition.type as SimpleSchemaGroup;
  return isEqualSchema(type.definitions[0].type as SimpleSchema, schema);
};

type ForEachKeyInSchemasCallbackFunction = (schema: SimpleSchema,
                                            path: string,
                                            pathFromRoot: string,
                                            hasChildren: boolean) => void;

export const forEachKeyInSchemas = (schema: SimpleSchema,
                                    callback: ForEachKeyInSchemasCallbackFunction,
                                    prefix: string = '',
                                    rootPathPrefix: string = ''): boolean => {
  const nodeNames: Array<string> = schema.objectKeys(prefix);
  if (!nodeNames) {
    console.warn('Could not find nodes for', prefix);
    return false;
  }

  let valuePrefix = '';
  if (prefix.length > 0) {
    valuePrefix = `${prefix}.`;
  }
  let rootPrefix = '';
  if (rootPathPrefix.length > 0) {
    rootPrefix = `${rootPathPrefix}.`;
  }

  nodeNames.forEach((name) => {
    const definitionPath = `${valuePrefix}${name}`;
    const pathFromRoot = `${rootPrefix}${name}`;
    const typeDefinition = schema.getDefinition(definitionPath, ['type']);
    const origDefinition = schema.schema(definitionPath);

    let hasChildren = false;
    if (!origDefinition || !origDefinition.accessibility || !origDefinition.accessibility.inseparable) {
      if (isDefinitionTypeSchema(typeDefinition.type)) {
        hasChildren = forEachKeyInSchemas(typeDefinition.type[0].type as SimpleSchema, callback, '', pathFromRoot);
      } else if (isDefinitionTypeArray(typeDefinition.type)) {
        const arrayPath = definitionPath + '.$';
        const rootArrayPath = pathFromRoot + '.$';

        const arrayFieldDefinition = schema.getDefinition(arrayPath);
        if (isDefinitionTypeSchema(arrayFieldDefinition.type)) {
          hasChildren = forEachKeyInSchemas(arrayFieldDefinition.type[0].type as SimpleSchema, callback, '', rootArrayPath);
        } else {
          hasChildren = forEachKeyInSchemas(schema, callback, arrayPath, rootArrayPath);
        }
      } else {
        hasChildren = forEachKeyInSchemas(schema, callback, definitionPath, pathFromRoot);
      }
    }

    callback(schema, definitionPath, pathFromRoot, hasChildren);
  });

  return nodeNames.length > 0;
};

export const translateAcFormatToUniforms = (rootSchema: SimpleSchema) => {
  forEachKeyInSchemas(rootSchema, (schema, definitionKey) => {
    const extensions: { [key: string]: any } = {};

    const type = schema.getQuickTypeForKey(definitionKey);
    const definition = schema.schema(definitionKey);
    const accessibility: AccessibilitySchemaExtension | undefined = definition.accessibility;

    if (type === 'boolean') {
      assignUpdate(extensions, [definitionKey, 'uniforms'], {
        component: YesNoQuestion,
        selfSubmitting: true,
      });
    } else if (type === 'string' && definitionKey === 'category') {
      assignUpdate(extensions, [definitionKey, 'uniforms'], {
        component: ChooseCategoryQuestion,
      });
    } else if (!type) {
      if (definitionHasSchema(definition as SchemaDefinition, PointGeometrySchema)) {
        assignUpdate(extensions, [definitionKey, 'uniforms'], {
          component: PlaceOnMapQuestion,
        });
      } else if (definitionHasSchema(definition as SchemaDefinition, LengthQuantitySchema)) {
        assignUpdate(extensions, [definitionKey, 'uniforms'], {
          component: UnitQuantityQuestion,
        });
      }
    }

    if (accessibility) {
      assignUpdate(extensions, [definitionKey, 'uniforms'], {
        placeholder: accessibility.example || definition.label,
      });

      if (accessibility.description) {
        extensions[definitionKey].uniforms.help = accessibility.description;
      }
      if (accessibility.preferredUnit) {
        extensions[definitionKey].uniforms.preferredUnit = accessibility.preferredUnit;
      }
    }

    schema.extend(extensions);
  });
};
