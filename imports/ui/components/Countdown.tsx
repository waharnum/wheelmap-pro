import * as React from 'react';
import * as moment from 'moment';

import {withTime} from './Timed';
import {Moment} from 'moment';

type CountdownProps = { start: moment.Moment, moment: moment.Moment };

const CountdownInternal = (props: CountdownProps) => {
  const isInFuture = props.start.isAfter(props.moment);
  const first = isInFuture ? props.start : props.moment;
  const second = isInFuture ? props.moment : props.start;

  return (
    <section className="event-countdown">
    <span className="days-countdown">
      {first.diff(second, 'days')}
      <small>{'days'}</small>
      </span>
      <span className="hours-countdown">
      {first.diff(second, 'hours') % 24}
        <small>{'hours'}</small>
      </span>
      <span className="minutes-countdown">
      {first.diff(second, 'minutes') % 60}
        <small>'minutes'}</small>
    </span>
      <span className="seconds-countdown">
      {first.diff(second, 'seconds') % 60}
        <small>{'seconds'}</small>
    </span>
    </section>
  );
};

export const Countdown = withTime(CountdownInternal, 1000);
