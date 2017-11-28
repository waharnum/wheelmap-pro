import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['uniforms']);

console.log(SimpleSchema);

import {AccessibilitySchemaExtension} from '@sozialhelden/ac-format';

console.log(SimpleSchema);

import {isDefinitionTypeArray, isDefinitionTypeSchema} from './simpl-schema-filter';

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
    const definition = schema.getDefinition(definitionKey);

    const accessibility: AccessibilitySchemaExtension | undefined = definition.accessibility;
    if (accessibility) {
      extensions[definitionKey] = {
        uniforms: {
          placeholder: accessibility.example,
          help: accessibility.description,
        },
      };
    }

    if (isDefinitionTypeSchema(definition.type)) {
      translateAcFormatToUniforms(definition.type[0].type, '');
    } else if (isDefinitionTypeArray(definition.type)) {
      const arrayKey = definitionKey + '.$';
      const arrayFieldDefinition = schema.getDefinition(arrayKey);
      if (isDefinitionTypeSchema(arrayFieldDefinition.type)) {
        translateAcFormatToUniforms(arrayFieldDefinition.type[0].type, '');
      } else {
        translateAcFormatToUniforms(schema, arrayKey);
      }
    } else {
      translateAcFormatToUniforms(schema, definitionKey);
    }
  });

  schema.extend(extensions);
};
