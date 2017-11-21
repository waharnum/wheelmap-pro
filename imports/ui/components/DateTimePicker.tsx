import * as React from 'react';
import connectField from 'uniforms/connectField';
import * as Datetime from 'react-datetime';
import * as moment from 'moment';

function isMoment(value: moment.Moment | string): value is moment.Moment {
  return (value as moment.Moment).toDate !== undefined;
}

const DateTimePicker = (options: { onChange: (value: Date | null) => void, value: Date }) =>
  <Datetime
    value={options.value}
    onChange={(moment: moment.Moment | string) => {
      if (isMoment(moment)) {
        options.onChange(moment.toDate());
      } else {
        options.onChange(null);
      }
    }}
  />
;

export default connectField(DateTimePicker);
