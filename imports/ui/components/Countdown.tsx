import * as React from 'react';
import * as moment from 'moment';

import {withTime} from './Timed';

const CountdownInternal = (props: { start: moment.Moment, now: moment.Moment }) => (
  <section className="event-countdown">
    <span className="days-countdown">
      {props.start.diff(props.now, 'days')}
      <small>{'days'}</small>
      </span>
    <span className="hours-countdown">
      {props.start.diff(props.now, 'hours') % 24}
      <small>{'hours'}</small>
      </span>
    <span className="minutes-countdown">
      {props.start.diff(props.now, 'minutes') % 60}
      <small>'minutes'}</small>
    </span>
    <span className="seconds-countdown">
      {props.start.diff(props.now, 'seconds') % 60}
      <small>{'seconds'}</small>
    </span>
  </section>
);

export const Countdown = withTime(CountdownInternal, 1000);
