import SimpleSchema from 'simpl-schema';
import {gettext} from 'c-3po';
import {cloneDeep} from 'lodash';

const registeredSchemas: Array<SimpleSchema> = [];

export function registerSchemaForI18n(schema: SimpleSchema) {
  registeredSchemas.push(schema);
}

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").
export function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

export function localeChanged(locale: string) {
  registeredSchemas.forEach((schema) => {
    const orig = (schema as any)._origSchema || (schema as any)._schema;
    const result = (schema as any)._origSchema ? (schema as any)._schema : cloneDeep(orig); // only clone initially

    // TODO recurse into sub object
    Object.keys(orig).forEach((key) => {
      const origNode = orig[key];
      const resultNode = result[key];

      // TODO translate more properties
      if (origNode.label) {
        resultNode.label = gettext(origNode.label);
      }
      if (origNode.uniforms) {
        if (origNode.uniforms.help) {
          resultNode.uniforms.help = gettext(origNode.uniforms.help);
        }
        if (origNode.uniforms.placeholder) {
          resultNode.uniforms.placeholder = gettext(origNode.uniforms.placeholder);
        }
        if (origNode.uniforms.options) {
          resultNode.uniforms.options = origNode.uniforms.options.map(
            (option) => Object.assign({}, option, {label: gettext(option.label)}));
        }
      }
    });

    (schema as any)._origSchema = orig;
    (schema as any)._schema = result;
  });
}
