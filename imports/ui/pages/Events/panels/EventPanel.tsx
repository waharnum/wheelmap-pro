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

function actionFromEventStatus(event: IEvent) {
  switch (event.status) {
    case 'planned':
      return <Button className="join-button btn-primary"
                     to="">{t`Join`}</Button>;
    case 'ongoing':
      return <Button className="join-button btn-primary"
                     to={`/new/organization/${event.organizationId}/events/${event._id}/mapping`}>
        {t`Start mapping`}
      </Button>;
  }

  return null;
}

type Props = {
  event: IEvent;
};

class EventPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, event} = this.props;

    return (
      <div className={className}>
        <CornerRibbon title={getLabelForEventStatus(event.status)} color={getColorForEventStatus(event.status)}/>
        <section className="header-section">
          <div>
            <h3>{event.name}</h3>
            <h4>{moment(event.startTime).format('LLLL')}</h4>
          </div>
          <div className="event-actions">
            <ShareAction event={event}/>
            {actionFromEventStatus(event)}
          </div>
        </section>
        <section className="statistics-section">
          <EventStatistics
            event={event}
            planned={true}
            countdown="short"/>
        </section>
        <section className="details-section">
          <div>{event.regionName}</div>
          <div>{event.description}</div>
        </section>
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
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
`;
