import { IEventParticipant } from '../../../both/api/event-participants/event-participants';
import { Countdown } from '../../components/Countdown';
import { IOrganization } from '../../../both/api/organizations/organizations';
import * as moment from 'moment';
import * as React from 'react';
import styled from 'styled-components';

import { colors } from '../../stylesheets/colors';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import AdminTab from '../../components/AdminTab';
import { default as AdminHeader, HeaderTitle } from '../../components/AdminHeader';

import { reactiveSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';
import { Events, EventStatusEnum, IEvent } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';
import { withTime } from '../../components/Timed';
import EventTabs from './EventTabs';
import {wrapDataComponent} from '../../components/AsyncDataComponent';

interface IPageModel {
  event: IEvent;
  participants: IEventParticipant[];
  organization: IOrganization;
}
interface IOrganizeEventPageState extends IPageModel {
  status: string;
  hasInvitees: boolean;
  hasPicture: boolean;
  resultsShared: boolean;
  stats: {invited: number, registered: number};
}

const determineCssClassesFromState = (state: IOrganizeEventPageState) => {
  switch (state.status) {
    case 'draft':
    case 'planned':
      if (state.hasInvitees) {
        return {
          createEvent: 'finished',
          inviteParticipants: 'finished',
          organizerTips: 'finished-last',
          startEvent: 'todo',
          setEventPicture: 'disabled',
          shareResults: 'disabled',
        };
      }
      return {
        createEvent: 'finished',
        inviteParticipants: 'todo',
        organizerTips: 'enabled',
        startEvent: 'disabled',
        setEventPicture: 'disabled',
        shareResults: 'disabled',
      };
    case 'ongoing':
      return {
        createEvent: 'finished',
        inviteParticipants: 'finished',
        organizerTips: 'finished',
        startEvent: 'finished-last',
        setEventPicture: 'disabled',
        shareResults: 'disabled',
      };
    case 'completed':
      if (state.resultsShared) {
        return {
          createEvent: 'finished',
          inviteParticipants: 'finished',
          organizerTips: 'finished',
          startEvent: 'finished',
          setEventPicture: 'finished',
          shareResults: 'finished-last',
        };
      }
      if (state.hasPicture) {
        return {
          createEvent: 'finished',
          inviteParticipants: 'finished',
          organizerTips: 'finished',
          startEvent: 'finished',
          setEventPicture: 'finished-last',
          shareResults: 'todo',
        };
      }
      return {
        createEvent: 'finished',
        inviteParticipants: 'finished',
        organizerTips: 'finished',
        startEvent: 'finished-last',
        setEventPicture: 'todo',
        shareResults: 'disabled',
      };
    case 'canceled':
      return {
        createEvent: 'disabled',
        inviteParticipants: 'disabled',
        organizerTips: 'disabled',
        startEvent: 'disabled',
        setEventPicture: 'disabled',
        shareResults: 'disabled',
      };
    default:
      throw new Meteor.Error(503, `Invalid status '${state.status}' found`);
  }
};

class OrganizeEventPage extends React.Component<IAsyncDataByIdProps < IPageModel > & IStyledComponent,
  IOrganizeEventPageState> {

  public state: IOrganizeEventPageState = {
    status: 'draft',
    hasInvitees: false,
    hasPicture: false,
    resultsShared: false,
    stats: {invited: 0, registered: 0},
    event: {} as IEvent,
    organization: {} as IOrganization,
    participants: [],
  };

  public componentWillMount() {
    this.updateState(this.props);
  }

  public componentWillReceiveProps(nextProps: IAsyncDataByIdProps < IPageModel >) {
    this.updateState(nextProps);
  }

  public updateState(props: IAsyncDataByIdProps < IPageModel >) {
    const stats = props.model.participants.reduce(
      (sum, value) => {
        sum.invited += 1;
        if (value.invitationState === 'accepted') {
          sum.registered += 1;
        }
        return sum;
      },
      {invited: 0, registered: 0});
    this.setState({
      event: props.model.event,
      organization: props.model.organization,
      participants: props.model.participants,
      stats,
      status: props.model.event.status,
      hasInvitees: stats.invited > 0,
      hasPicture: !!props.model.event.photoUrl,
      resultsShared: false,
    });
  }

  public render(): JSX.Element {
    const event = this.state.event;
    const organization = this.state.organization;
    const stats = this.state.stats;

    const stepStates = determineCssClassesFromState(this.state);

    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={(
            // TODO: Move to shared component
            <HeaderTitle
              title={event.name}
              prefixTitle={organization.name as string}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}/organize`}
            />
          )}
          tabs={(<EventTabs id={event._id || ''} />)}
          publicLink={`/events/${event._id}`}
        />
        <div className="content-area scrollable">
          <div className="stats event-stats">
            <section className="participant-stats">
              <span className="participants-invited">{stats.invited}<small>invited</small></span>
              <span className="participants-registered key-figure">{stats.registered}<small>registered</small></span>
            </section>
            <Countdown start={moment(event.startTime)} />
            <section className="location-stats">
              <span className="locations-planned">0<small>planned</small></span>
              <span className="locations-mapped key-figure">0<small>mapped</small></span>
            </section>
          </div>
          <ol className="event-timeline before-event">
            <li className={'event-timeline-step event-details ' + stepStates.createEvent}>
              <div className="notification-completed">Event created successfully.</div>
              <div className="step-details">
                <div className="event-name">
                  {event.name}
                  <Button to={`/events/${event._id}/edit`}>Edit</Button>
                </div>
                <div className="event-description">{event.description}</div>
                <div className="event-date">{moment(event.startTime).format('LLLL')}</div>
                <div className="event-location">{event.regionName}</div>
              </div>
            </li>
            <li className={'event-timeline-step invite-participants ' + stepStates.inviteParticipants}>
              <div className="notification-completed">{stats.invited} invitations sent.</div>
              <div className="step-status step-todo">
                <div className="step-information">
                  <h3>No participants invited.</h3>
                  <p>Emails will be send when you publish.</p>
                </div>
                <Button className="btn-primary" to={`/events/${event._id}/participants`}>Invite participants</Button>
              </div>
              <div className="step-status step-completed">
                <div className="step-information">
                  <h3>{stats.invited} participants invited.</h3>
                  <p>Emails will be send when you publish.</p>
                </div>
                <Button to={`/events/${event._id}/participants`}>Invite more</Button>
              </div>
            </li>
            <li className={'event-timeline-step organizer-tips ' + stepStates.organizerTips}>
              <div className="notification-completed">1 document to read.</div>
              <div className="step-status">
                <h3>Tips for event organizers</h3>
                <a className="btn" target="_blank"
                    href="https://developmentseed.org/blog/2015/06/07/organizing-mapathons/">Learn more</a>
              </div>
            </li>
          </ol>
          <ol className="event-timeline during-event">
            <h2>Publish event</h2>
            <li className={'event-timeline-step publish-event ' + stepStates.startEvent}>
              <div className="step-status step-todo">
                <div className="step-information">
                  <h3>Mapping event still a draft</h3>
                  <p>Please make sure all details are correct. When you publish, invitation emails will be sent.</p>
                </div>
                <div className="publishing-actions">
                  <Button to="#">Publish event</Button>
                </div>
              </div>
              <div className="notification-completed step-active">Congratulations! Your event has been published</div>
              <div className="step-status step-active">
                <div className="step-information">
                  <h3>Mapping event published</h3>
                  <p>Your event is now online. It will be closed the day after. Be careful when canceling your event: you can not undo this.</p>
                </div>
                <div className="publishing-actions">
                  <Button to={`/events/${event._id}`}>View event</Button>
                  <Button className="btn-primary" to='.'>Cancel event</Button>
                </div>
              </div>
              <div className="notification-completed step-completed">Your event has been completed</div>
              <div className="step-status step-completed">
                <div className="step-information">
                  <h3>Mapping event finished</h3>
                  <p>Your event is over now.</p>
                </div>
                <div className="publishing-actions">
                  <Button to={`/events/${event._id}`}>View event</Button>
                </div>
              </div>
            </li>
          </ol>
          <ol className="event-timeline after-event">
            <h2>After the event</h2>
            <li className={'event-timeline-step set-event-picture ' + stepStates.setEventPicture}>
              <div className="notification-completed">Event picture has been set.</div>
              <div className="step-status step-todo">
                <h3>Set event picture</h3>
              </div>
              <div className="step-status step-active">
                <h3>Set event picture</h3>
                <Button to={`/events/${event._id}/edit`}>Set</Button>
              </div>
              <div className="step-status step-completed">
                <section>
                  <h3>Event picture was set</h3>
                  <Button to={`/events/${event._id}/edit`}>Edit</Button>
                </section>
                <img src={event.photoUrl} />
              </div>
            </li>
            <li className={'event-timeline-step share-results ' + stepStates.shareResults}>
              <div className="notification-completed">Great. You may share the link now.</div>
              <div className="step-status step-todo">
                <h3>Share results</h3>
              </div>
              <div className="step-status step-active">
                <h3>Share results</h3>
                <Button to={`/events/${event._id}`}>Share</Button>
              </div>
              <div className="step-status step-completed">
                <h3>Results have been shared</h3>
                <Button to={`/events/${event._id}`}>View</Button>
              </div>
            </li>
          </ol>
        </div>
      </ScrollableLayout>
    );
  }
};

const ReactiveOrganizeOrganisationsPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(OrganizeEventPage),
  (id) : IPageModel | null => {
    const event = Events.findOne(id);
    const participants = event ? event.getParticipants() : [];
    const organization = event ? event.getOrganization() : null;
    return event && organization ? { event, participants, organization } : null;
  },
  // TODO: this should be changed to a private query. maybe.
  'events.by_id.private', 'eventParticipants.by_eventId.private', 'organizations.by_eventId.public');

export default styled(ReactiveOrganizeOrganisationsPage) `

/* -------------------------- event stats styling --------------------------------*/

.content-area {
  padding-top: 0;
  padding-left: 0; /* to have a marginless stats bar */
  padding-right: 0; /* to have a marginless stats bar */
}

.stats {
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
    
    &:before { background-image: url(/images/icon-person@2x.png); }
  }

  section.event-countdown {

    &:before { background-image: url(/images/icon-date@2x.png); }
  }
  
  section.location-stats {
    border-left: 1px solid ${colors.shadowGrey};

    &:before { background-image: url(/images/icon-location@2x.png); }
  }
}
/* -------------------------- event timeline styling -----------------------------------*/

ol.event-timeline.before-event {
  padding-top: 20px;
}

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
    font-size: 21px;
    font-weight: 300 !important;
  }

  li.event-timeline-step {
    position: relative;
    width: 44em;
    max-width: 90vw;
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

      .step-information {
        width: 20em;
        display: flex;
        flex-direction: column;
      }
      
      .publishing-actions {
        margin-left: 20px;
        display: flex;
        align-items: flex-start;
      }
    }
  }

  /* ---------- display logic for steps with multiple sub-states  --------------*/
 
  li.todo, 
  li.disabled {
    .step-completed, 
    .step-active { 
      display: none; 
    }
    .step-todo { 
      display: flex; 
    }
  }
  
  li.todo {
    .step-todo, 
    .step-completed { 
      display: none; 
    }
    .step-active { 
      display: flex; 
    }
  }
  
  li.finished, li.finished-last {
    .step-todo, 
    .step-active { 
      display: none; 
    }
    .step-completed { 
      display: flex;
    }
  }

  /* -------------------------- step stylings -----------------------------------*/

  /* step-icons */
  li.event-details .step-status:before { content: " "; }
  li.invite-participants .step-status:before { content: "∏"; } 
  li.organizer-tips .step-status:before { content: ""; } 
  li.publish-event .step-todo:before { content: ""; }
  li.publish-event .step-active:before { content: ""; }
  li.publish-event .step-completed:before { content: ""; }  
  li.set-event-picture .step-status:before{ content: "π"; }
  li.share-results .step-todo:before  { content: ""; }
  li.share-results .step-active:before  { content: ""; }
  li.share-results .step-completed:before  { content: ""; }

  li.enabled,
  li.finished-last,
  li.finished {
    a.btn {
      line-height: 24px;
      padding: 0;
      background-color: transparent;
    }
  }

  li.disabled,
  li.todo,
  li.finished {
    .notification-completed {
      display: none;
    }
  }

  li.todo,
  li.finished-last,
  li.finished {
    background-color: white;
    box-shadow: 0 0 2px 0 ${colors.boxShadow};

    &:before {
      background-color: white;
      box-shadow: 0 0 2px 0 ${colors.boxShadow};  
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

  li.todo {

    &:before,
    .step-status:before,
    h3 {
      color: ${colors.activeOrange};
      opacity: 1;
    }

    &:before { /* arrow indicating active step */
      content: "D";
    }

    h3 {
      font-weight: 400 !important;
    }
  }


  li.finished,
  li.finished-last {

    &:before { /* checkmark */
      content: ""; 
    }
  }

  li.finished {
    
    &:before { /* checkmark */
      color: ${colors.doneGreen};
    }
  }

  li.finished-last {
  
    &:before { /* checkmark */
      color: white;
      background-color: ${colors.doneGreen};
    }

    .notification-completed {
      display: block;
      margin: 0;
      padding: 13px 20px 13px 20px;
      border-radius: 4px 4px 0 0;
      font-size: 21px;
      font-weight: 400;
      color: ${colors.darkGreen};
      background-color: ${colors.bgLightGreen};
    }
  }

  /* ---------------------- specific step stylings ---------------------- */

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

  li.publish-event.todo .step-status.step-todo{
    a.btn { /*white button with outline */
      padding: 0 16px;
      font-size: 16px;
      line-height: 40px;
      color: ${colors.bgAnthracite} !important;
      background: transparent;
      border: 1px solid ${colors.shadowGrey};
    
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  /* wrap differently with event image */
  li.set-event-picture {
    .step-completed {
      flex-direction: column;
    }

    section {
      display: flex;
      flex-direction: row;    
      justify-content: space-between;
    }

    img {
      max-width: 100%;
      margin-top: 20px;
    }
  }
}

`;
