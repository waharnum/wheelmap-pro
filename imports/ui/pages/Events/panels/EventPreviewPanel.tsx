import * as React from 'react';
import styled from 'styled-components';

import * as moment from 'moment';

import {IStyledComponent} from '../../../components/IStyledComponent';
import {getColorForEventStatus, getLabelForEventStatus} from '../../../../both/api/events/eventStatus';
import {IEvent} from '../../../../both/api/events/events';
import EventStatistics from '../../Events/EventStatistics';
import CornerRibbon from '../../../components/CornerRibbon';
import CloseIcon from 'wheelmap-react/lib/components/icons/actions/Close';


type Props = {
  event: IEvent;
  onClickPanel?: () => void;
};

class EventPreviewPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, event, onClickPanel} = this.props;

    return (
      <div className={className}>
        <CornerRibbon title={getLabelForEventStatus(event.status)} color={getColorForEventStatus(event.status)}/>
        <div className="event-information" onClick={onClickPanel}>
          <div className="event-description">
            <h3>{event.name}</h3>
            <h4>{moment(event.startTime).format('LLLL')}</h4>
          </div>
        </div>
        <EventStatistics
          event={event}
          planned={true}
          countdown="short"/>
      </div>
    );
  }
};

export default styled(EventPreviewPanel) `
  // shared between all panels
  flex: 1;
  padding: 0 10px;
  
  // custom styles
  .event-information {
    cursor: pointer;
  }
  
  .event-statistics {
    margin-top: 15px; 
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
`;
