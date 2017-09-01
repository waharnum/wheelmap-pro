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
    _id: "123",
    name: "Mapathon Montreal",
    description: 'We are an international organization for medical emergency relief. We provide medical emergency assistance in crisis and war zones. We collect medical facilities such as doctors, pharmacies and hospitals.',
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
        <div className="event-stats">
          <section className="participant-stats">
            <span className="participants-invited">0<small>invited</small></span>
            <span className="participants-registered key-figure">0<small>registered</small></span>
          </section>
          <section className="event-countdown">
            <span className="days-countdown">27<small>days</small></span>
            <span className="hours-countdown">11<small>hours</small></span>
            <span className="minutes-countdown">13<small>minutes</small></span>
            <span className="seconds-countdown">10<small>seconds</small></span>
          </section>
          <section className="location-stats">
            <span className="locations-planned">0<small>planned</small></span>
            <span className="locations-mapped key-figure">0<small>mapped</small></span>
          </section>
        </div>
        <ol className="event-timeline before-event">
          <li className="event-timeline-step event-details completed finished-last">
            <div className="notification-completed">Event created successfully.</div>
            <div className={props.className+ " step-details"}>
              <div className="event-name">
                {model.name}
                <Button to={`/events/edit/${model._id}`}>Edit</Button>
              </div>
              <div className="event-description">{model.description}</div>
              <div className="event-date">9. September 2017</div>
              <div className="event-location">{model.regionName}</div>
            </div>
          </li>
          <li className="event-timeline-step invite-participants active">
            <div className="notification-completed">3 invitations sent.</div>
            <div className="step-status">
              <h3>No participants invited.</h3>
              <Button className="btn-primary" to={`/events/edit/${model._id}`}>Invite participants</Button>
            </div>
          </li>
          <li className="event-timeline-step organizer-tips enabled">
          <div className="notification-completed">2 documents created.</div>
            <div className="step-status">
              <h3>Tips for event organizers</h3>
              <Button to={`/events/edit/${model._id}`}>Learn more</Button>
            </div>
          </li>
        </ol>
        <ol className="event-timeline during-event">
          <h2>During the event</h2>
          <li className="event-timeline-step start-event disabled">
            <div className="notification-completed">Your event has been started!</div>
            <div className="step-status">
              <h3>Mapping event not started</h3>
              <Button to={`/events/edit/${model._id}`}>Start mapping event</Button>
            </div>
          </li>
        </ol>
        <ol className="event-timeline after-event">
          <h2>After the event</h2>
          <li className="event-timeline-step set-event-picture disabled">
            <div className="notification-completed">Event picture has been set.</div>
            <div className="step-status">
              <h3>Set event picture</h3>
              <Button to={`/events/edit/${model._id}`}>Edit</Button>
            </div>
          </li>
          <li className="event-timeline-step share-results disabled">
            <div className="notification-completed">Results have been shared</div>
            <div className="step-status">
              <h3>Share results</h3>
              <Button to={`/events/edit/${model._id}`}>Share</Button>
            </div>
          </li>
        </ol>
      </div>
    </ScrollableLayout>
  );
};

export default styled(OrganizeEventPage) `

/* -------------------------- event stats styling --------------------------------*/

.content-area {
  padding-top: 0;
  padding-left: 0; /* to have a marginless stats bar */
  padding-right: 0; /* to have a marginless stats bar */
}

.event-stats {
  padding-top: 20px;
  background-color: white;
  border-bottom: 1px solid ${colors.shadowGrey};
  display: flex;
  justify-content: space-between;
  
  section {
    padding: 0px 20px 0 20px;
    text-align: center;
    display: flex;

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
      background-size: 100% 100%;
    }
  }

  section.participant-stats {
    border-right: 1px solid ${colors.shadowGrey};
    
    &:before {
      background-image: url(/images/icon-person@2x.png); 
    }
  }

  section.event-countdown {

    &:before {
      background-image: url(/images/icon-date@2x.png); 
    }
  }
  
  section.location-stats {
    border-left: 1px solid ${colors.shadowGrey};

    &:before {
      background-image: url(/images/icon-location@2x.png); 
    }
  }
}

/* -------------------------- event timeline styling -----------------------------------*/

ol.event-timeline {
  margin-left: 40px;
  margin-right: 20px;
  margin-bottom: 0px;
  padding-bottom: 30px;
  border-left: 2px solid rgba(0, 0, 0, 0.1);

  &:first-child {
    padding-top: 20px;
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

    border-radius: 4px;   
    display: flex;
    flex-direction: column;

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

    .step-status {
      position: relative;
      padding: 20px 20px 20px 48px;
      display: flex;
      justify-content: space-between;

      &:before { /* step icon */
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

    .notification-completed {
      display: none;
      margin: 0;
      padding: 17px 20px 17px 20px;
      border-radius: 4px 4px 0 0;
      font-size: 18px;
      font-weight: 400;
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

  li.enabled a,
  li.completed a {
    padding: 0;
    color: ${colors.ctaBlue};
    background-color: transparent;
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

  li.completed:before {
    content: "";
    color: ${colors.doneGreen};
  }
  
  li.finished-last {

    .notification-completed {
      display: block;
    }

    &:before,
    &:after,
    .notification-completed,
    .notification-completed a {
      opacity: 1;
      color: white;
      background-color: ${colors.doneGreen};
    }

    h3 {
      font-weight: 400;
    }
  }

  li.active {
    
    &:before,
    .step-status:before {
      color: ${colors.activeOrange};
      opacity: 1;
    }

    &:before {
      content: "D";
    }

    h3 {
      color: ${colors.activeOrange};
      font-weight: 400;
    }

    a.btn-primary {
      display: block;
    }
  }

  li.event-details .step-status:before { content: " "; }
  li.invite-participants .step-status:before { content: "∏"; } 
  li.organizer-tips .step-status:before { content: ""; } 
  li.start-event .step-status:before { content: "O"; } 
  li.set-event-picture .step-status:before{ content: "π"; }
  li.share-results .step-status:before  { content: ""; }

  li.event-details {
    padding: 0;
    color: initial;
    background-color: white;
    display: flex;
    flex-direction: column;

    &:after {
      display: none;
    }

    div {
      padding: 20px;
    }
    
    .step-details {
      padding: 0;

      div {
        position: relative;
        padding-left: 48px;
        border-bottom: 1px solid ${colors.shadowGrey};
        font-size: 21px;
        font-weight: 300;
        
        &:first-child,
        &:last-child {
          border-bottom: none;
        }

        &:before {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
          content: "C";
          color: ${colors.bgAnthracite};
          opacity: 0.5;
          font-family: "iconfield-v03";
          font-size: 21px;
          text-align: center;
          }
      }

      .event-name {
        padding-bottom: 0;
        display: flex;
        justify-content: space-between;

        &:before {
          content: "I";
        }
      }

      .event-description {
        padding-top: 0;
        padding-left: 50px;
        padding-right: 60px;
        font-size: 14px;

        &:before {
          content: "";
        }
      }

      .event-date:before { content: "˙"; }
      .event-location:before { content: "y"; }
    }
  }
}

ol.event-timeline.before-event {
  padding-top: 20px;
}

`;
; ;