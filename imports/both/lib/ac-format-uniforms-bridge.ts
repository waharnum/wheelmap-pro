import SimpleSchema from 'simpl-schema';
import {AccessibilitySchemaExtension, LengthQuantitySchema, PointGeometrySchema} from '@sozialhelden/ac-format';

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

const hasSchema = (typeDefinition: EvaluatedSchemaDefinition, schema: SimpleSchema) => {
  // as schema instances are wildly different and get duplicated all the time, we hash their keys&types and go with that
  return hashSchema(schema) === hashSchema(typeDefinition.type[0].type as SimpleSchema);
};

export const translateAcFormatToUniforms = (schema: SimpleSchema, prefix: string = '') => {
  const nodeNames: Array<string> = schema.objectKeys(prefix);

  if (!nodeNames) {
    console.log('Could not find nodes for', prefix);
    return [];
  }

  let valuePrefix = '';
  if (prefix.length > 0) {
    valuePrefix = `${prefix}.`;
  }

  const extensions: { [key: string]: any } = {};
  nodeNames.forEach((name) => {
    const definitionKey = `${valuePrefix}${name}`;
    const type = schema.getQuickTypeForKey(definitionKey);

    const typeDefinition = schema.getDefinition(definitionKey, ['type']);

    const accessibility: AccessibilitySchemaExtension | undefined = typeDefinition.accessibility;

    if (type === 'boolean') {
      extensions[definitionKey] = extensions[definitionKey] || {};
      extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
      extensions[definitionKey].uniforms.component = YesNoQuestion;
      extensions[definitionKey].uniforms.selfSubmitting = true;
    } else if (type === 'string' && name === 'category') { // TODO find a better way of identifying this
      extensions[definitionKey] = extensions[definitionKey] || {};
      extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
      extensions[definitionKey].uniforms.component = ChooseCategoryQuestion;
    } else if (!type) {
      if (hasSchema(typeDefinition, PointGeometrySchema)) {
        extensions[definitionKey] = extensions[definitionKey] || {};
        extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
        extensions[definitionKey].uniforms.component = PlaceOnMapQuestion;
      } else if (hasSchema(typeDefinition, LengthQuantitySchema)) {
        extensions[definitionKey] = extensions[definitionKey] || {};
        extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
        extensions[definitionKey].uniforms.component = UnitQuantityQuestion;
      }
    }

    if (accessibility) {
      extensions[definitionKey] = extensions[definitionKey] || {};
      extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
      extensions[definitionKey].uniforms.placeholder = accessibility.example || typeDefinition.label;

      if (accessibility.description) {
        extensions[definitionKey].uniforms.help = accessibility.description;
      }

      if (accessibility.preferredUnit) {
        extensions[definitionKey].uniforms.preferredUnit = accessibility.preferredUnit;
      }
    }

    if (isDefinitionTypeSchema(typeDefinition.type)) {
      translateAcFormatToUniforms(typeDefinition.type[0].type as SimpleSchema, '');
    } else if (isDefinitionTypeArray(typeDefinition.type)) {
      const arrayKey = definitionKey + '.$';
      const arrayFieldDefinition = schema.getDefinition(arrayKey);
      if (isDefinitionTypeSchema(arrayFieldDefinition.type)) {
        translateAcFormatToUniforms(arrayFieldDefinition.type[0].type as SimpleSchema, '');
      } else {
        translateAcFormatToUniforms(schema, arrayKey);
      }
    } else {
      translateAcFormatToUniforms(schema, definitionKey);
    }
  });

  schema.extend(extensions);
};
