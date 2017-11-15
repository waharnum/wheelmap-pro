import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../../components/IStyledComponent';
import {IEvent} from '../../../both/api/events/events';
import {stat} from 'fs';

interface IOrganizationStatistics {
  action?: JSX.Element | null;
  events: Array<IEvent>;
};

class OrganizationStatistics extends React.Component<IOrganizationStatistics & IStyledComponent> {
  public render(): JSX.Element | null {
    const organizationStatistics = OrganizationStatistics.calculateStatisticsFromEvents(this.props.events);

    return (
      <div className={`${this.props.className} organization-stats`}>
        <section className="participant-stats">
          <span className="participants-invited">
            {organizationStatistics.totalInvitedParticipantsCount}
            <small>{t`invited`}</small></span>
          <span className="participants-registered key-figure">
            {organizationStatistics.totalRegisteredParticipantsCount}
            <small>{t`registered`}</small></span>
        </section>
        <section className="location-stats">
          <span className="locations-planned">
            {organizationStatistics.totalPlannedPlacesCount}
            <small>{t`planned`}</small></span>
          <span className="locations-mapped key-figure">
            {organizationStatistics.totalMappedPlacesCount}
            <small>{t`mapped`}</small></span>
        </section>
        <section className="event-stats">
          <span className="events-planned key-figure">
            {organizationStatistics.totalEventsCount}
            <small>{t`created`}</small></span>
          <span className="events-completed">
            {organizationStatistics.totalCompletedEventsCount}
            <small>{t`completed`}</small></span>
        </section>
        {this.props.action}
      </div>
    );
  }

  static calculateStatisticsFromEvents = (events: Array<IEvent>) => {
    const statistics = {
      totalInvitedParticipantsCount: 0,
      totalRegisteredParticipantsCount: 0,
      totalPlannedPlacesCount: 0,
      totalMappedPlacesCount: 0,
      totalEventsCount: 0,
      totalCompletedEventsCount: 0,
    };

    return events.reduce((previousValue, event) => {
      previousValue.totalEventsCount += 1;
      if (event.status == 'completed')
        previousValue.totalCompletedEventsCount += 1;
      if (event.statistics) {
        previousValue.totalInvitedParticipantsCount += event.statistics.fullParticipantCount;
        previousValue.totalRegisteredParticipantsCount += event.statistics.acceptedParticipantCount;
        previousValue.totalMappedPlacesCount += event.statistics.mappedPlacesCount;
      }
      if (event.targets && event.targets.mappedPlacesCount) {
        previousValue.totalPlannedPlacesCount += event.targets.mappedPlacesCount;
      }
      return previousValue;
    }, statistics);
  }
}

export default styled<IOrganizationStatistics & IStyledComponent>(OrganizationStatistics) `

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
    background-image: url(/images/icon-person@2x.png); 
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
section.new-event:before { 
  width: 0;
  height: 0;
  background-image: none; 
}

section.new-event {
  padding-bottom: 20px;
}
`;
