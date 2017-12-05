import SimpleSchema from 'simpl-schema';

const rawFieldDurationData = {
  'string': 8,
  'number': 5,
  'boolean': 2,
  'date': 8,
  'object': 5,
  'stringArray': 8,
  'numberArray': 5,
  'booleanArray': 2,
  'dateArray': 8,
  'objectArray': 5,
};

// the amount of time it takes per entering another array value
export const nextValueSwitchOverhead = 2;

// the amount of time it takes when diving down another hierarchy
export const newBlockSwitchOverhead = 2;

export const determineDuration = (schema: SimpleSchema, definitionKey: string): number => {
  const type = schema.getQuickTypeForKey(definitionKey);
  const definition = schema.getDefinition(definitionKey, ['allowedValues', 'minCount', 'maxCount']);

  // unknown fields take 5 seconds
  let baseDuration = 5;

  if (type) {
    const rawFieldDuration = rawFieldDurationData[type];
    if (rawFieldDuration !== null) {
      baseDuration = rawFieldDuration;
    }
  }

  // limited to certain values
  if (definition.allowedValues) {
    const count = definition.allowedValues.length;
    if (count <= 4) {
      // 4 elements or fewer are an easy pick
      baseDuration = 2;
    } else if (count <= 8) {
      // 8 elements or fewer are a choice
      baseDuration = 5;
    } else {
      // should have a type ahead filter of some kind
      baseDuration = 12;
    }
  }

  // TODO evaluate special fields

  // multiple choice
  if (type && type.endsWith('Array')) {
    const minCount = Math.max(definition.minCount || 0, 1);
    baseDuration = (baseDuration + nextValueSwitchOverhead) * minCount;
  }

  return baseDuration;
};
