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
  onClose?: () => void;
};

class EventPreviewPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, event, onClickPanel, onClose} = this.props;

    return (
      <div className={className}>
        <a className="close-icon" onClick={() => onClose && onClose()}>
          <CloseIcon/>
        </a>
        <CornerRibbon title={getLabelForEventStatus(event.status)} color={getColorForEventStatus(event.status)}/>
        <div className="event-information" onClick={onClickPanel}>
          <div className="event-description">
            <h3>{event.name}</h3>
            <h4>{moment(event.startTime).format('LLLL')}</h4>
            <p>{event.description}</p>
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
  padding: 10px;
  
  .close-icon {
    display: block;
    position: absolute;
    padding: 6px 8px 0 0;
    color: rgba(0,0,0,0.3);
    text-decoration: none;
    text-align: center;
    z-index: 1;
    top: 0px;
    right: 0px;
    pointer-events: all;
    cursor: pointer;
  }
  
  // custom styles
  .event-information {
    cursor: pointer;
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
