import * as React from 'react';
import styled from 'styled-components';

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
    _id: "123",
    name: "Some mapathon",
    description: 'asj dflkjsdf ;lajksdf;l akjdfadf',
    regionName: 'Montreal',
    startTime: new Date("2017-10-10 12:10:12"),
    endTime: new Date("2017-10-10 15:10:12"),
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
            <h3>Event created successfully</h3>
            <div className={props.className || ''}>
              <div>{model.description}</div>
              <div>{model.webSiteUrl}</div>
              <div>{model.photoUrl}</div>
              <Button to={`/events/edit/${model._id}`}>Edit</Button>
            </div>
          </li>
          <li className="event-timeline-step invite-participants active">
            <h3>No participants invited.</h3>
            <Button to={`/events/edit/${model._id}`}>Invite participants</Button>
          </li>
          <li className="event-timeline-step organizer-tips enabled">
            <h3>Read tips for event organizers</h3>
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
          <li className="event-timeline-step share results disabled">
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
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.2);

  &:first-child {
    margin-top: 20px;
  }

  h2,
  h3 {
    margin:0;
  }

  h2 {
    margin-top: 14px;
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
    margin: 14px 0 14px 20px;
    padding: 20px;
    border-radius: 4px;   
    display: flex;
    justify-content: space-between;
    
    &:before{
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
  }
  
  li.completed,
  li.enabled,
  li.active {
    background-color: white;
    box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);

    &:before {
      background-color: white;
      box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);  
    }
  }

  li.disabled {
    border: 1px solid #DEE1E7;
    background: #F2F3F5;
  
    &:before {
      border: 1px solid #DEE1E7;
      background: #F2F3F5;
    }
  }

  li.completed {

    &:before {
      color: white;
      content: "";
      background-color: #96C545;
    }

    h3 {
      color: white;
      font-weight: 400;
      background-color: #96C545;
    }
  }

  li.active {

    &:before {
      color: #F5A623;
      content: "D";
    }

    h3 {
      color: #F5A623;
      font-weight: 400;
    }
  }

}


`;
;;