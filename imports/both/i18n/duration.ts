import * as moment from 'moment';
import {take, dropWhile, flow, findIndex, reject, map, join} from 'lodash/fp';
import {t} from 'c-3po';

const translatedShortUnit = {
  'years': t`y`,
  'months': t`m`,
  'days': t`d`,
  'hours': t`h`,
  'minutes': t`min`,
  'seconds': t`s`,
};

// Return a short human readable string representing the given moment duration
export function stringifyDuration(durationInSeconds: number) {
  const duration = moment.duration(durationInSeconds, 'seconds');

  const allParts = [
    {value: duration.years(), unit: 'years'},
    {value: duration.months(), unit: 'months'},
    {value: duration.days(), unit: 'days'},
    {value: duration.hours(), unit: 'hours'},
    {value: duration.minutes(), unit: 'minutes'},
    {value: duration.seconds(), unit: 'seconds'},
  ];

  if (durationInSeconds <= 1) {
    return `0${translatedShortUnit['seconds']}`;
  }

  const shortDuration = flow(
    // drop the most significant parts with a value of 0
    dropWhile((part) => part.value === 0),
    // skip other zeroes in the middle (moment.humanize() can't format them)
    reject((part) => part.value === 0),
    // Display up to two of the most significant remaining parts
    take(2),
    map((part) => `${part.value}${translatedShortUnit[part.unit]}`),
    join(' '),
  );

  return shortDuration(allParts);
};
