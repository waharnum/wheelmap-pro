import * as React from 'react';
import styled from 'styled-components';
import { gettext, t } from 'c-3po';
import { toast } from 'react-toastify';
import ClipboardButton from 'react-clipboard.js';
import * as moment from 'moment';
import { browserHistory } from 'react-router';

import { IStyledComponent } from '../../../components/IStyledComponent';
import { getColorForEventStatus, getLabelForEventStatus } from '../../../../both/api/events/eventStatus';
import { IEvent } from '../../../../both/api/events/events';
import EventStatistics from '../../Events/EventStatistics';
import CornerRibbon from '../../../components/CornerRibbon';
import Button from '../../../components/Button';
import Countdown from '../../../components/Countdown';
import { colors } from '../../../stylesheets/colors';
import { IEventParticipant } from '../../../../both/api/event-participants/event-participants';


const ShareAction = (props: { event: IEvent }) => (
  <ClipboardButton className="btn btn-dark"
    data-clipboard-text={window.location.href}
    onSuccess={() => {
      toast.success(t`Link copied to clipboard`);
    }}>
    {t`Share Link`}
  </ClipboardButton>
);

const BringEquipmentBlock = (props: {}) => (
  <section className="details-section equipment-block">
    <span>{t`If possible can you bring the following items…`}</span>
    <ul>
      <li className="icon icon-ruler">
        {t`A Ruler`}
        <small>{t`or other tools to measure door widths and step heights.`}</small>
      </li>
      <li className="icon icon-smartphone">
        {t`A Smartphone`}
        <small>{t`or tablet with internet connection.`}</small>
      </li>
      <li className="icon icon-beverages">
        {t`Some Beverages`}
        <small>{t`snacks will be provided by us.`}</small>
      </li>
    </ul>
  </section>
);

const FinishedEventContent = styled((props: { event: IEvent, className?: string }) => {
  const { event, className } = props;

  const barGraphAchieved =
    event.statistics && event.targets &&
      event.targets.mappedPlacesCount && event.targets.mappedPlacesCount > 0 ?
      Math.floor(100 * event.statistics.mappedPlacesCount / event.targets.mappedPlacesCount) : null;

  return (
    <section className={`details-section ${className}`}>
      <section className="graphical-stats">
        <div className="participant-count">
          {event.statistics ? event.statistics.acceptedParticipantCount : 0}
        </div>
        <div className="participants-block">
          <section className="participants-label">
            {t`Participants`}
          </section>
          <section className="participants-icons">
            {Array(event.statistics ? (event.statistics.acceptedParticipantCount + 1) : 0).join('p ­')}
          </section>
        </div>
      </section>
      <div className="stats-box">
        <div className="places-block">
          <section className="poi-icon" />
          <section className="planned-label">
            <p>{event.targets ? event.targets.mappedPlacesCount : 0}</p>
            <small>{t`Planned`}</small>
          </section>
          <section className="achieved-label">
            <p>{event.statistics ? event.statistics.mappedPlacesCount : 0}</p>
            <small>{t`Achieved`}</small>
          </section>
        </div>
        {barGraphAchieved !== null ?
          <div className="places-graph">
            <section style={{ width: `${barGraphAchieved}%` }} className="bar-graph-achieved" />
            <section style={{ width: `${100 - barGraphAchieved}%` }} className="bar-graph-planned" />
          </div>
          : null
        }
      </div>
    </section>
  );
}) `
  padding: 10px;

  .places-block {
    display: flex;
    justify-content: space-between;
    
    .poi-icon {
      content: " ";
      width: 42px;
      height: 42px;
      background-image: url(/images/icon-location@2x.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    
    section {
      text-align: center;

      p {
        margin: 0;
        padding-top: 4px;
        font-size: 32px;
        line-height: 28px;
        font-weight: 200;
      }

      small {
        font-size: 11px;
        line-height: 11px;
        font-weight: 300;
        text-transform: uppercase;
      }
    }

    section.achieved-label p {
      font-weight: 800;
    }
  }

  .places-graph {
    margin-top: 4px;
    border: 1px black solid;
    line-height: 0;
    
    section {
      width: 30%;
      height: 18px;      
      padding-right: 4px;
      line-height: 18px;
      display: inline-block;
      text-align: right;
      font-weight: 400;
    }
    
    .bar-graph-achieved {
      background-color: ${colors.ctaGreen};
      color: white;
      padding: 0;
    }
    .bar-graph-remaining {
      background-color: ${colors.errorRed};
      color: white;
      padding: 0;
    }
  }

  section.graphical-stats {
    padding: 10px;
    width: 100%;
    
    .participant-count {
      font-size: 42px;
      font-weight: 800;
      line-height: 36px;
    }
    
    .participants-block {
      margin-right: 10px;
      display: flex;
      justify-content: flex-start;
      
      section.participants-label {
        margin-right: 10px;
        margin-top: 4px;
        font-weight: 400;
        font-size: 11px;
        line-height: 14px;
        text-transform: uppercase;
      }
  
      section.participants-icons {          
        margin-right: 10px;
        font-family: 'iconfield-v03';
        font-size: 11px;
      }
    }
  }
`;

const removeEventParticipation = (participant?: IEventParticipant | null) => {
  if (participant) {
    Meteor.call('eventParticipants.remove', participant._id, (error, result) => {
      if (error) {
        toast.error(gettext(error.reason));
      }
    });
  }
};

const addEventParticipation = (user: Meteor.User | null, event: IEvent) => {
  if (user) {
    Meteor.call('eventParticipants.acceptPublicInvitation',
      { eventId: event._id, invitationToken: event.invitationToken },
      (error) => {
        if (error) {
          toast.error(error.reason);
        }
      },
    );
  } else {
    browserHistory.push(
      `/organizations/${event.organizationId}/events/${event._id}/public-invitation/${event.invitationToken}`);
  }
};

function actionFromEventStatus(event: IEvent, user?: Meteor.User | null, participant?: IEventParticipant | null) {
  const shareAction = <ShareAction key="share" event={event} />;
  const joinAction = event.invitationToken ? (
    <button key="join"
      className="join-button btn btn-primary"
      onClick={addEventParticipation.bind(this, user, event)}>
      {t`Join Us`}
    </button>) : null;
  const mappingAction = (<Button key="map" className="map-button btn-primary"
    to={`/organizations/${event.organizationId}/events/${event._id}/mapping`}>
    {t`Start mapping`}
  </Button>);
  const canceledLabel = <span className="canceled-label">{getLabelForEventStatus(event.status)}</span>;
  const removeParticipationAction = (
    <button key="remove-participation" className="remove-participation-button btn btn-primary"
      onClick={removeEventParticipation.bind(this, participant)}>
      {t`Going`}</button>);


  const userHasJoined = participant && participant.invitationState === 'accepted';

  switch (event.status) {
    case 'completed':
      return shareAction;
    case 'planned':
      return [shareAction, userHasJoined ? removeParticipationAction : joinAction];
    case 'ongoing':
      return [shareAction, userHasJoined ? removeParticipationAction : joinAction, userHasJoined && mappingAction];
    case 'canceled':
      return canceledLabel;
  }

  return null;
}

function detailsFromEventStatus(event: IEvent) {
  switch (event.status) {
    case 'draft':
    case 'planned':
    case 'ongoing':
      return (<BringEquipmentBlock />);
    case 'completed':
      return (<FinishedEventContent event={event} />);
  }

  return null;
}

type Props = {
  event: IEvent;
  user?: Meteor.User | null;
  participant?: IEventParticipant | null;
  showActions?: boolean;
};

class EventPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const { className, event, user, participant, showActions } = this.props;
    const showCountDown = event.status !== 'canceled' && event.status !== 'completed';
    const countDownSection = showCountDown ? (<section className="countdown-section">
      <Countdown start={moment(event.startTime)} />
    </section>) : null;

    const hasResults = ['draft', 'planned', 'canceled'].indexOf(event.status) < 0;
    const userHasJoined = participant && participant.invitationState === 'accepted';

    return (
      <div className={`${className} event-status-${event.status}`}>
        <CornerRibbon title={getLabelForEventStatus(event.status)} color={getColorForEventStatus(event.status)} />
        {event.photoUrl ? <img src={event.photoUrl} alt={t`Event picture`} /> : null}
        <section className="header-section">
          <div>
            <h3>{event.name}</h3>
            <h4 className="event-date">{moment(event.startTime).format('LLLL')}</h4>
          </div>
          <div className="event-actions">
            {(showActions !== false) && actionFromEventStatus(event, user, participant)}
          </div>
        </section>
        <section className="statistics-section">
          <EventStatistics
            event={event}
            userHasJoined={!!userHasJoined}
            achieved={hasResults}
            planned={!hasResults}
            countdown="short" />
        </section>
        <section className="details-section">
          <h4>{event.regionName}</h4>
          <div>{event.description}</div>
        </section>
        {detailsFromEventStatus(event)}
        {countDownSection}
      </div>
    );
  }
}

export default styled(EventPanel) `
  // shared between all panels
  flex: 1;
  
  img {
    min-height: 88px;
    max-height: 200px;
    width: 100%;
    object-fit: cover;
  }
    
  h3 {
    font-size: 22px;
    margin: 0;
    margin-right: 100px;
  }
  
  h4 {
    font-size: 16px;
    margin: 0;
    opacity: 0.6;
  }
  
  .header-section, .statistics-section, .details-section {
    border-bottom: 1px solid ${colors.shadowGrey};
  }
  
  .header-section, .statistics-section, .details-section, .countdown-section {
    padding: 10px 10px 10px 20px;
  }
  
  .event-actions {
    padding: 0 35px 0 15px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;    
    flex-wrap: wrap;
  }
  
  .remove-participation-button {
    background: ${colors.bgGreyDarker};
    padding-right: 35px;
    position: relative;
    color: rgba(0,0,0,0.8);
    
    &:after {
      content: '';
      position: absolute;
      font-weight: 200;
      color: black;
      opacity: 0.5;
      font-family: 'iconfield-v03';
      width: 24px;
      line-height: 24px;
      height: 24px;
      text-align: center;
      top: 6px;
      right: 7px;
    }
    
    &:hover, :focus, :focus:hover  {
      background: ${colors.errorRed};
      
      &:after {
        content: '';
      }
    }
    

  }

  li.icon {
    &::before {
      content:" ";
      height: 33px;
      width: 33px;
      display:block;
      position:absolute;
      left:9px;
      mask-image: url(/images/icons/beverage.svg);
      mask-size: cover;
      background-color: #888;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }

  .equipment-block {
    ul {
      padding: 10px 10px 10px 40px;
      
      li {
        &.icon-ruler::before {
          mask-image: url(/images/icons/ruler.svg);
        }
        &.icon-smartphone::before {
          mask-image: url(/images/icons/smartphone.svg);
        }

        display: flex;
        flex-direction: column;
        font-size: 24px;
        font-weight: 200;
        margin-top: 10px;
     
        small {
          font-size: 14px;
          font-weight: 300;
        }
      }  
    }
  }
  
  // canceled event
  &.event-status-canceled {
    span.canceled-label {
      color: ${colors.errorRed};
      text-transform: uppercase;
    }
    
    .event-date {
      text-decoration: line-through;
    }
  }
  
`;
