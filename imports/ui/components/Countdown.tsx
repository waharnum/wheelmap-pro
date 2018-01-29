import * as React from 'react';
import * as moment from 'moment';
import {t} from 'c-3po';
import styled from 'styled-components';

import {withTime} from './Timed';
import {IStyledComponent} from './IStyledComponent';

type CountdownProps = { start: moment.Moment; now: moment.Moment } & IStyledComponent;

const CountdownInternal = (props: CountdownProps) => {
  const isInFuture = props.start.isAfter(props.now);
  const first = isInFuture ? props.start : props.now;
  const second = isInFuture ? props.now : props.start;

  return (
    <section className={`event-countdown ${props.className}`}>
      <span className="days-countdown">
        {first.diff(second, 'days')}
        <small>{t`days`}</small>
      </span>
      <span className="hours-countdown">
        {first.diff(second, 'hours') % 24}
        <small>{t`hours`}</small>
      </span>
      <span className="minutes-countdown">
        {first.diff(second, 'minutes') % 60}
        <small>{t`minutes`}</small>
      </span>
      <span className="seconds-countdown">
        {first.diff(second, 'seconds') % 60}
        <small>{t`seconds`}</small>
      </span>
    </section>
  );
};

const Countdown = withTime(CountdownInternal, 1000);

export default styled(Countdown)`
  &.event-countdown {
    display: flex;    
    justify-content: center;
        
    span {
      display: flex;
      flex-direction: column;    
      font-size: 30px;
      line-height: 30px;
      font-weight: 200;    
      align-items: center;
      flex: 1;
      
      small {
        font-size: 11px;
        line-height: 11px;
        font-weight: 300;
        text-transform: uppercase;
      }
    }
  }
`;
