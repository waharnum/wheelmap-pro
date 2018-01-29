import * as React from 'react';
import styled from 'styled-components';
import {t} from 'c-3po';
import {toast} from 'react-toastify';
import ClipboardButton from 'react-clipboard.js';
import * as moment from 'moment';

import {IStyledComponent} from '../../../components/IStyledComponent';
import {getColorForEventStatus, getLabelForEventStatus} from '../../../../both/api/events/eventStatus';
import {IEvent} from '../../../../both/api/events/events';
import EventStatistics from '../../Events/EventStatistics';
import CornerRibbon from '../../../components/CornerRibbon';
import Button from '../../../components/Button';
import Countdown from '../../../components/Countdown';
import {colors} from '../../../stylesheets/colors';


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

function actionFromEventStatus(event: IEvent) {
  switch (event.status) {
    case 'completed':
      return <ShareAction event={event}/>;
    case 'planned':
      return [
        <ShareAction event={event}/>,
        <Button className="join-button btn-primary"
                to="">{t`Join Us`}</Button>];
    case 'ongoing':
      return [
        <ShareAction event={event}/>,
        <Button className="join-button btn-primary"
                to={`/new/organization/${event.organizationId}/events/${event._id}/mapping`}>
          {t`Start mapping`}
        </Button>];
    case 'canceled':
      return <span className="canceled-label">{getLabelForEventStatus(event.status)}</span>;
  }

  return null;
}

function detailsFromEventStatus(event: IEvent) {
  switch (event.status) {
    case 'completed':
      return <ShareAction event={event}/>;
    case 'draft':
    case 'planned':
    case 'ongoing':
      return <BringEquipmentBlock/>;
  }

  return null;
}

type Props = {
  event: IEvent;
};

class EventPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, event} = this.props;

    const isPlanned = ['draft', 'planned', 'canceled'].indexOf(event.status) >= 0;

    return (
      <div className={`${className} event-status-${event.status}`}>
        <CornerRibbon title={getLabelForEventStatus(event.status)} color={getColorForEventStatus(event.status)}/>
        {event.photoUrl ? <img src={event.photoUrl} alt={t`Event picture`}/> : null}
        <section className="header-section">
          <div>
            <h3>{event.name}</h3>
            <h4 className="event-date">{moment(event.startTime).format('LLLL')}</h4>
          </div>
          <div className="event-actions">
            {actionFromEventStatus(event)}
          </div>
        </section>
        <section className="statistics-section">
          <EventStatistics
            event={event}
            achieved={!isPlanned}
            planned={isPlanned}
            countdown="short"/>
        </section>
        <section className="details-section">
          <h4>{event.regionName}</h4>
          <div>{event.description}</div>
        </section>
        {detailsFromEventStatus(event)}
        <section className="countdown-section">
          <Countdown start={moment(event.startTime)}/>
        </section>
      </div>
    );
  }
};

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
    padding: 10px;
  }
  
  .event-actions {
    padding: 0 35px 0 15px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  .equipment-block {
    ul {
      padding: 10px 10px 10px 40px;
      
      li {
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
