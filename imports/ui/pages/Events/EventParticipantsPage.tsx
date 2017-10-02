import styled from 'styled-components';
import {uniq} from 'lodash';
import {AutoForm, SubmitField} from 'uniforms-bootstrap3';
import * as React from 'react';
import * as ClipboardButton from 'react-clipboard.js';

import EventTabs from './EventTabs';
import {IOrganization} from '../../../both/api/organizations/organizations';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {Hint, HintBox} from '../../components/HintBox';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {EventParticipantInviteSchema} from '../../../both/api/event-participants/schema';
import {IEventParticipant} from '../../../both/api/event-participants/event-participants';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

const invitationsListSchema = EventParticipantInviteSchema.pick(
  'invitationEmailAddresses', 'invitationEmailAddresses.$');

interface IPageModel {
  event: IEvent;
  participants: IEventParticipant[];
  organization: IOrganization;
}

const removeParticipant = (id: Mongo.ObjectID) => {
  Meteor.call('eventParticipants.remove', id, (error, result) => {
    // TODO: handle error!
    console.log('eventParticipants.remove', error, result);
  });
};

const CustomSubmitField = () => <SubmitField value="Send invites"/>;

const EventParticipantEntry = (props: { model: IEventParticipant }) => (
  <li className="participant-entry">
    <section className="participant-icon" dangerouslySetInnerHTML={{__html: props.model.getIconHTML()}}/>
    <section className="participant-name">{props.model.getUserName()}</section>
    <section className="participant-user glyphicon">{props.model.userId ? 'p' : ''}</section>
    <section className="participant-state">{props.model.invitationState}</section>
    {props.model.invitationState === 'error' ?
      <section className="participant-error">{props.model.invitationError}</section> : null}
    <section className="participant-remove glyphicon">
      <a onClick={() => removeParticipant(props.model._id || '')}>x</a>
    </section>
  </li>
);

class EventParticipantsPage extends React.Component<IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public state = {isSaving: false};
  private formRef: AutoForm;

  public render(): JSX.Element {
    const event = this.props.model.event;
    const organization = this.props.model.organization;
    const participants = this.props.model.participants;

    const hasPublicInvitation = event.invitationToken && event.status !== 'draft';
    const link = Meteor.absoluteUrl(`events/${event._id}/public-invitation/${event.invitationToken}`);

    return (
      <ScrollableLayout id="EventParticipantsPage" className={this.props.className}>
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
          tabs={<EventTabs id={event._id || ''}/>}
          publicLink={`/events/${event._id}`}
        />
        <div className="content-area scrollable hsplit">
          <div className="content-left">
            <h2>Invite Participants to event</h2>
            <AutoForm
              placeholder={true}
              showInlineError={true}
              disabled={this.state.isSaving}
              schema={invitationsListSchema}
              submitField={CustomSubmitField}
              onSubmit={this.onSubmit}
              ref={this.storeFormReference}
            />
            {hasPublicInvitation ? this.renderPublicInvitation(link) : null}
          </div>
          <div className="content-right">
            <HintBox title={event.status === 'draft' ?
              'The event is not published yet.' : 'You made this event public.'}>
              <Hint className="user">
                Invited people will receive a personal invitation which is only valid for them.
              </Hint>
              <Hint className="group">
                Everybody with the share-link below can join.
              </Hint>
            </HintBox>
            <div className="participants-box">
              <h3>Invited Participants</h3>
              <ol>
                {participants.length === 0 ? <section>No one invited yet.</section> : null}
                {participants.map((p) => (<EventParticipantEntry key={String(p._id)} model={p}/>))}
              </ol>
            </div>
          </div>
        </div>
      </ScrollableLayout>
    );
  }

  private renderPublicInvitation = (link: string): JSX.Element => {
    return (
      <section><h2>Share a link</h2>
        <div>
          You can also share the following link to invite people,
          e.g. via Social Media or handouts.
          <form>
            <div className="field form-group copy-to-clipboard">
              <input className="form-group" type="text" id="public-link" value={link} disabled={true}/>
              <ClipboardButton className="btn btn-dark" data-clipboard-text={link}>
                Copy to clipboard
              </ClipboardButton>
            </div>
          </form>
        </div>
      </section>
    );
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private cleanUpEmailAddresses = (invitationEmailAddresses: string[]): string[] => {
    // remove all dupes and null values, trim emails and convert to lower case
    return uniq(invitationEmailAddresses.map((s) => s.toLowerCase().trim())).filter(Boolean);
  }

  private onSubmit = (doc: { invitationEmailAddresses: string[] }) => {
    this.setState({isSaving: true});
    return new Promise((resolve, reject) => {
      Meteor.call('eventParticipants.invite', {
        invitationEmailAddresses: this.cleanUpEmailAddresses(doc.invitationEmailAddresses),
        eventId: this.props.model.event._id,
      }, (error: any, result: any) => {
        this.setState({isSaving: false});
        if (!error) {
          resolve(true);
        } else {
          reject(error);
        }
      });
    }).then(() => {
      this.formRef.setState({validate: false});
      this.formRef.change('invitationEmailAddresses', ['']);
    }, (error) => {
      this.formRef.setState({error});
    });
  }
}

const ReactiveEventParticipantsPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(EventParticipantsPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const participants = event ? event.getParticipants() : [];
    const eventUsers = participants.map((p) => p.userId);
    const participantUsers = Meteor.users.find({_id: {$in: eventUsers}}).fetch();
    const organization = event ? event.getOrganization() : null;
    return event && organization ? {event, participants, organization} : null;
  },
  'events.by_id.private', 'eventParticipants.by_eventId.private', 'organizations.by_eventId.private', 'users.private');

export default styled(ReactiveEventParticipantsPage) `

  .participants-box {
    margin-left: 2em;

    h3 {
      padding-bottom: 1em;
      font-size: 20px;
      line-height: 24px;
      font-weight: 300;
    }

    .participant-entry {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      padding-left: 1em;

      section {
        margin-left: 5px;      
      }

      .participant-icon img {
        width: 24px;
      }
      .participant-name {
        flex-grow: 1;
      }
      .participant-state {

      }
      .participant-error {

      }
      .participant-remove a {
        color: red;
      }
    }
  }

  .panel-body {    
    > div:nth-of-type(2) .badge {
      background: none;
      i {
        display: none;
      }
    }
  }

  .copy-to-clipboard {
    display: flex;

    button {    
      padding-left: 30px;
      padding-right: 10px;
      position: relative;

      &::before {
        position: absolute;
        left: 12px;
        top: 14px;
        color: #767e8a;
        font-family: "iconfield-v03", serif;
        content: '';
      }
    }
  }


`;
