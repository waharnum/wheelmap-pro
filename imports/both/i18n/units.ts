const data = {
  'length': {
    'en_UK': 'inch',
    'en_US': 'inch',
    '*': 'cm',
  },
};

export const getPreferredUnitForKind = (unitKind: string, preferredUnit: string, locale?: string): string | 'unknown' => {
  if (!data[unitKind]) {
    console.error(`Could not find unit for ${unitKind}`);
    return 'unknown';
  }

  return (locale ? data[unitKind][locale] || data[unitKind]['*'] : data[unitKind]['*']) || 'unknown';
};
