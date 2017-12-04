const data = {
  'length': 'cm',
};

export const getPreferredUnitForKind = (unitKind: string, preferredUnit: string, locale?: string): string => {
  return data[unitKind] || 'unknown';
};
