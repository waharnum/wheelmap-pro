import * as React from 'react';
import connectField from 'uniforms/connectField';
import * as Datetime from 'react-datetime';
import * as moment from 'moment';
import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';

function isMoment(value: moment.Moment | string): value is moment.Moment {
  return (value as moment.Moment).toDate !== undefined;
}

const DateTimePicker = (props: { onChange: (value: Date | null) => void, value: Date } & IStyledComponent) =>
  <Datetime
    className={props.className}
    value={props.value}
    onChange={(moment: moment.Moment | string) => {
      if (isMoment(moment)) {
        props.onChange(moment.toDate());
      } else {
        props.onChange(null);
      }
    }}
  />
;

const DateTimePickerField = connectField(DateTimePicker);

export default styled(DateTimePickerField) `

  color: ${colors.bgAnthracite} !important;

  td.rdtActive {
    font-weight: 800 !important;
    background-color: ${colors.linkBlue} !important;
  }

  td.rdtToday {
    color: ${colors.bgAnthracite};
    font-weight: 800 !important;

    &::before {
      border-left: 7px solid transparent !important;
      border-bottom: 7px solid ${colors.linkBlue} !important;
    }
  }

  .rdtDays {

  }

`;
