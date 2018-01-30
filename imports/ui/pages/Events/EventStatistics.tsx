import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../../components/IStyledComponent';
import * as moment from 'moment';
import Countdown from '../../components/Countdown';
import {IEvent} from '../../../both/api/events/events';

type Props = {
  event: IEvent;
  userHasJoined?: boolean;
  action?: JSX.Element | null;
  countdown?: 'none' | 'full' | 'short';
  planned?: boolean;
  achieved?: boolean;
} & IStyledComponent;

class EventStatistics extends React.Component<Props> {

  public render(): JSX.Element | null {
    const {event, className, planned, achieved, countdown, action, userHasJoined} = this.props;

    return (
      <div className={`${className} event-statistics`}>
        {/* locations added */}
        <section className="location-stats">
          {planned ?
            <span className="locations-planned">
              {event.targets ? event.targets.mappedPlacesCount : 0}
              <small>{t`planned`}</small>
            </span> : null}
          {achieved ?
            <span className="locations-mapped key-figure">
              {event.statistics ? event.statistics.mappedPlacesCount : 0}
              <small>{t`mapped`}</small>
            </span> : null}
        </section>
        {/* long countdown */}
        {countdown === 'full' && event ?
          <Countdown start={moment(event.startTime)}/> : null}
        {/* participants */}
        <section className={`${userHasJoined ? 'user-has-joined' : ''} participant-stats`}>
          {planned ?
            <span className="participants-invited">
              {event.statistics ? event.statistics.invitedParticipantCount : 0}
              <small>{t`invited`}</small>
            </span> : null}
          {achieved ?
            <span className="participants-registered key-figure">
              {event.statistics ? event.statistics.acceptedParticipantCount : 0}
              <small>{t`accepted`}</small>
            </span> : null}
        </section>
        {/* days ago / days until */}
        {countdown === 'short' && event ?
          <section className="event-stats">
            {(event.startTime && event.startTime > new Date()) ?
              (<span className="time-until-event">
                {moment(event.startTime).diff(moment(), 'days')}
                <small>{t`Days Left`}</small>
              </span>) :
              (<span className="time-until-event">
                {moment().diff(moment(event.startTime), 'days')}
                <small>{t`Days Ago`}</small>
              </span>)
            }
          </section> : null}
        {/* action */}
        {action}
      </div>
    );
  }
}

export default styled(EventStatistics) `
display: flex;
justify-content: space-between;

padding-top: 10px;
padding-bottom: 10px;

section {
  flex-grow:1;
  padding: 0 3px;
  text-align: center;
  display: flex;
  justify-content: center;

  &:last-child {
    border-right: 0;
  }

  span {
    position: relative;        
    padding: 0 5px 0 5px;
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
    width: 25px;
    height: 25px;
    content: " ";
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    flex-shrink: 0;
  }
  
  &.user-has-joined { 
    span {
      font-size: 32px;
      font-weight: 800;
  
      &:after {
        content: "+1";
        background: ${colors.ctaGreen};
        color: ${colors.white100};
        text-align: center;
        line-height: 28px;
        width: 28px;
        height: 28px;
        position: absolute;
        font-size: 18px;
        font-weight: 600;
        border-radius: 14px;
        top: -14px;
        right: -14px;
      }
    }
  }
}

/* prefix icons*/  
section.participant-stats:before { background-image: url(/images/icon-person@2x.png); }
section.location-stats:before { background-image: url(/images/icon-location@2x.png); }
section.event-stats:before { background-image: url(/images/icon-date@2x.png); }
section.event-countdown { &:before { background-image: url(/images/icon-date@2x.png); } }

`;
