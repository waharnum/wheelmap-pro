import SimpleSchema from 'simpl-schema';
import {gettext} from 'c-3po';
import {cloneDeep} from 'lodash';

let registeredSchemas: Array<SimpleSchema> = [];

export function registerSchemaForI18n(schema: SimpleSchema) {
  registeredSchemas.push(schema);
}

export function localeChanged(locale: string) {
  registeredSchemas.forEach((schema) => {
    const orig = schema._origSchema || schema._schema;
    const result = schema._origSchema ? schema._schema : cloneDeep(orig); // only clone initially

    // TODO recurse into sub object
    Object.keys(orig).forEach((key) => {
      const origNode = orig[key];
      const resultNode = result[key];

      // TODO rename more properties
      if (origNode.label) {
        resultNode.label = gettext(origNode.label);
      }
      if (origNode.uniforms && origNode.uniforms.help) {
        resultNode.uniforms.help = gettext(origNode.uniforms.help);
      }
      if (origNode.uniforms && origNode.uniforms.placeholder) {
        resultNode.uniforms.placeholder = gettext(origNode.uniforms.placeholder);
      }
    });

    schema._origSchema = orig;
    schema._schema = result;
  })
}
