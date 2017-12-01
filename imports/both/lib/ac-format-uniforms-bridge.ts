import SimpleSchema from 'simpl-schema';
import {AccessibilitySchemaExtension} from '@sozialhelden/ac-format';

SimpleSchema.extendOptions(['uniforms']);

import {isDefinitionTypeArray, isDefinitionTypeSchema} from './simpl-schema-filter';
import YesNoQuestion from '../../ui/components/Questionaire/YesNoQuestion';

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

    const definition = schema.getDefinition(definitionKey, ['type']);

    if (type === 'boolean') {
      extensions[definitionKey] = extensions[definitionKey] || {};
      extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
      extensions[definitionKey].uniforms.component = YesNoQuestion;
      extensions[definitionKey].uniforms.selfSubmitting = true;
    }

    const accessibility: AccessibilitySchemaExtension | undefined = definition.accessibility;
    if (accessibility) {
      extensions[definitionKey] = extensions[definitionKey] || {};
      extensions[definitionKey].uniforms = extensions[definitionKey].uniforms || {};
      extensions[definitionKey].uniforms.placeholder = accessibility.example || definition.label;
      if (accessibility.description) {
        extensions[definitionKey].uniforms.help = accessibility.description;
      }
    }

    if (isDefinitionTypeSchema(definition.type)) {
      translateAcFormatToUniforms(definition.type[0].type as SimpleSchema, '');
    } else if (isDefinitionTypeArray(definition.type)) {
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
