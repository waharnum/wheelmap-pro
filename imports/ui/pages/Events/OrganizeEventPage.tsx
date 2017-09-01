import * as React from 'react';
import styled from 'styled-components'; 

import { colors } from '../../stylesheets/colors';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import AdminTab from '../../components/AdminTab';
import { default as AdminHeader, HeaderTitle } from '../../components/AdminHeader';

import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';
import EventTabs from './EventTabs';

const OrganizeEventPage = (props: IModelProps<IEvent> & IStyledComponent) => {
  const model = props.model || {
    _id: '123',
    organizationId: '123',
    name: 'Some mapathon',
    description: 'asj dflkjsdf ;lajksdf;l akjdfadf',
    regionName: 'Montreal',
    startTime: new Date('2017-10-10 12:10:12'),
    endTime: new Date('2017-10-10 15:10:12'),
    webSiteUrl: 'https://eventbrite.com',
    photoUrl: 'http://payload487.cargocollective.com/1/14/476606/12056934/prt_400x400_1483600669.jpg',
    invitationToken: '2a2fa3sdf4d34',
    verifyGpsPositionsOfEdits: true,
    targets: {
      mappedPlacesCount: 100,
    },
    status: 'planned',
    visibility: 'public',
  };

  console.log(props);
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader
        titleComponent={
          <HeaderTitle
            title={model.name}
            logo={<div className="organisation-logo" />}
          />
        }
        tabs={(<EventTabs />)}
      />
      <div className="content-area scrollable">
        <ol className="event-timeline before-event">
          <li className="event-timeline-step event-creation completed">
            <div className="event-creation-head">
              <h3>Event created successfully</h3>
            </div>
            <div className={props.className || ''}>
              <div>{model.name}</div>
              <div>{model.description}</div>
              <div>9. September 2017</div>
              <div>{model.regionName}</div>
              <Button to={`/events/edit/${model._id}`}>Edit</Button>
            </div>
          </li>
          <li className="event-timeline-step invite-participants active">
            <h3>No participants invited.</h3>
            <Button to={`/events/edit/${model._id}`}>Invite participants</Button>
          </li>
          <li className="event-timeline-step organizer-tips enabled">
            <h3>Tips for event organizers</h3>
            <Button to={`/events/edit/${model._id}`}>Learn more</Button>
          </li>
        </ol>
        <ol className="event-timeline during-event">
          <h2>During the event</h2>
          <li className="event-timeline-step start-event disabled">
            <h3>Mapping event not started</h3>
            <Button to={`/events/edit/${model._id}`}>Start mapping event</Button>
          </li>
        </ol>
        <ol className="event-timeline after-event">
          <h2>After the event</h2>
          <li className="event-timeline-step set-event-picture disabled">
            <h3>Set event picture</h3>
            <Button to={`/events/edit/${model._id}`}>Edit</Button>
          </li>
          <li className="event-timeline-step share-results disabled">
            <h3>Share results</h3>
            <Button to={`/events/edit/${model._id}`}>Share</Button>
          </li>
        </ol>
      </div>
    </ScrollableLayout>
  );
};

export default styled(OrganizeEventPage) `
ol.event-timeline {
  margin-left: 20px;
  margin-bottom: 0px;
  padding-bottom: 30px;
  border-left: 2px solid rgba(0, 0, 0, 0.1);

  &:first-child {
    margin-top: 20px;
  }

  h2,
  h3 {
    margin:0;
  }

  h2 {
    margin-left: 23px;
    font-size: 14px;
    font-weight: 300;
    text-transform: uppercase;
  }

  h3 {
    font-size: 18px;
    font-weight: 300;
  }

  li.event-timeline-step {
    position: relative;
    width: 44em;
    max-width: 90vv;
    margin: 14px 0 14px 23px;
    padding: 20px 20px 20px 48px;
    border-radius: 4px;   
    display: flex;
    justify-content: space-between;
    
    &:before{ /* checklist circle */
      content: " ";
      position: absolute;
      top: 14px;
      left: -40px;
      width: 32px;
      height: 32px;
      font-family: "iconfield-v03";
      font-size: 16px;
      line-height: 32px;
      text-align: center;
      border-radius: 16px;
    }

    &:after { /* step icon */
      content: "C";
      position: absolute;
      top: 15px;
      left: 20px;
      width: 20px;
      height: 20px;
      color: ${colors.bgAnthracite};
      opacity: 0.5;
      font-family: "iconfield-v03";
      font-size: 21px;
      text-align: center;
    }
  }
  
  li.completed,
  li.enabled,
  li.active {
    background-color: white;
    box-shadow: 0 0 2px 0 ${colors.boxShadow};

    &:before {
      background-color: white;
      box-shadow: 0 0 2px 0 ${colors.boxShadow};  
    }
  }

  li.enabled {

    a {
      padding: 0;
      color: ${colors.ctaBlue};
      background-color: transparent;
    }
  }

  li.disabled {
    border: 1px solid ${colors.shadowGrey};
    background-color: ${colors.bgGrey};
  
    &:before {
      border: 1px solid ${colors.shadowGrey};
      background-color: ${colors.bgGrey};
    }

    a.btn { 
      display: none;
    }
  }

  li.completed {
    color: white;
    background-color: ${colors.doneGreen};

    &:before,
    &:after { 
      color: white;
      opacity: 1;
      background-color: ${colors.doneGreen};
    }
    
    &:before {
      content: "";
    }

    h3 {
      font-weight: 400;
    }
  }

  li.active {

    &:before,
    &:after {
      color: #F5A623;
      opacity: 1;
    }

    &:before {
      content: "D";
    }

    h3 {
      color: #F5A623;
      font-weight: 400;
    }
  }

  li.event-creation:after { content: "¶"; }
  li.invite-participants:after { content: "∏"; } 
  li.organizer-tips:after { content: ""; } 
  li.start-event:after { content: "O"; } 
  li.set-event-picture:after { content: "π"; }
  li.share-results:after  { content: ""; }

  li.event-creation {
    padding: 0;
    color: initial;
    background-color: white;
    display: flex;
    flex-direction: column;

    div {
      padding: 20px;
    }

    .event-creation-head {
      padding: 20px 20px 20px 48px;
      color: white;
      background-color: ${colors.doneGreen};
      border-radius: 4px 4px 0 0;
    }
  }
}

`;
; ;