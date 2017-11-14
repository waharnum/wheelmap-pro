import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../../components/IStyledComponent';
import * as moment from 'moment';
import {Countdown} from '../../components/Countdown';
import {IEvent} from '../../../both/api/events/events';

interface IEventStatistics {
  event: IEvent;
  action?: JSX.Element | null;
  countdown?: 'none' | 'full' | 'short';
  planned?: boolean;
  achieved?: boolean;
};

class EventStatistics extends React.Component<IEventStatistics & IStyledComponent> {
  public render(): JSX.Element | null {
    return (
      <div className={`${this.props.className} event-statistics`}>
        {/* participants */}
        <section className="participant-stats">
          {this.props.planned ? <span className="participants-invited">99<small>{t`invited`}</small></span> : null}
          {this.props.achieved ? <span className="participants-registered key-figure">98<small>{t`registered`}</small></span> : null}
        </section>
        {/* long countdown */}
        {this.props.countdown == 'full' && this.props.event ?
          <Countdown start={moment(this.props.event.startTime)}/> : null}
        {/* locations added */}
        <section className="location-stats">
          {this.props.planned ? <span className="locations-planned">99<small>{t`planned`}</small></span> : null}
          {this.props.achieved ? <span className="locations-mapped key-figure">98<small>{t`mapped`}</small></span> : null}
        </section>
        {/* days ago / days until */}
        {this.props.countdown == 'short' && this.props.event ?
          <section className="event-stats">
            {(this.props.event.startTime && this.props.event.startTime > new Date()) ?
              (<span className="time-until-event key-figure">
                          {moment(this.props.event.startTime).diff(moment(), 'days')}
                <small>{t`Days Left`}</small>
               </span>) :
              (<span className="time-until-event key-figure">
                            {moment().diff(moment(this.props.event.startTime), 'days')}
                <small>{t`Days Ago`}</small>
               </span>)
            }
          </section> : null}
        {/* action */}
        {this.props.action}
      </div>
    );
  }
}

export default styled<IEventStatistics & IStyledComponent>(EventStatistics) `

padding-top: 20px;
background-color: white;
display: flex;
justify-content: space-between;

section {
  padding: 0px 20px 0 20px;
  text-align: center;
  border-right: 1px solid ${colors.shadowGrey};
  display: flex;

  &:last-child {
    border-right: 0;
  }

  span {
    position: relative;
    padding: 0 10px 16px 10px;
    font-size: 30px;
    line-height: 30px;
    font-weight: 200;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.key-figure {
      font-size: 32px;
      font-weight: 800;
    }

    small {
      font-size: 11px;
      line-height: 11px;
      font-weight: 300;
      text-transform: uppercase;
    }
  }

  &:before {
    position: relative;
    top: 2px;
    left: 0;
    width: 27px;
    height: 27px;
    content: " ";
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    flex-shrink: 0;
  }
}

/* prefix icons*/  
section.participant-stats:before { background-image: url(/images/icon-person@2x.png); }
section.location-stats:before { background-image: url(/images/icon-location@2x.png); }
section.event-stats:before { background-image: url(/images/icon-date@2x.png); }
section.event-countdown { &:before { background-image: url(/images/icon-date@2x.png); } }

section.new-event:before { 
  width: 0;
  height: 0;
  background-image: none; 
}

section.new-event {
  padding-bottom: 20px;
}
`;
