import styled from 'styled-components';
import { uniq } from 'lodash';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import * as React from 'react';
import SubmitField from 'uniforms-bootstrap3/SubmitField';
import SimpleSchema from 'simpl-schema';

import EventTabs from './EventTabs';
import {IOrganization} from '../../../both/api/organizations/organizations';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';
import {EventParticipantInviteSchema} from '../../../both/api/event-participants/schema';
import { EventParticipants, IEventParticipant } from '../../../both/api/event-participants/event-participants';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

const invitationsListSchema = EventParticipantInviteSchema.pick(
  'invitationEmailAddresses', 'invitationEmailAddresses.$');

interface IPageModel {
  event: IEvent;
  participants: IEventParticipant[];
  organization: IOrganization;
}

const removeParticipant = (id: Mongo.ObjectID) => {
  Meteor.call('eventParticipants.remove', id, (error, result) => {
    console.log('eventParticipants.remove', error, result);
  });
};

const CustomSubmitField = (props) => <SubmitField value="Send invites" />;

const EventParticpantEntry = (props: { model: IEventParticipant }) => (
  <div className="particpant-entry">
    <section className="particpant-icon" dangerouslySetInnerHTML={{ __html: props.model.getIconHTML()}} />
    <section className="particpant-name">{props.model.getUserName()}</section>
    <section className="particpant-state">{props.model.invitationState}</section>
    {props.model.invitationState === 'error' ?
        <section className="particpant-error">{props.model.invitationError}</section> : null}
    <section className="participant-remove glyphicon">
      <button onClick={() => removeParticipant(props.model._id || '')}>x</button>
    </section>
  </div>
);

class EventParticipantsPage extends React.Component<
    IAsyncDataByIdProps<IPageModel> & IStyledComponent> {

  public state = { isSaving: false };
  private formRef: AutoForm;

  public render(): JSX.Element {
    const event = this.props.model.event;
    const organization = this.props.model.organization;
    const participants = this.props.model.participants;

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
          tabs={<EventTabs id={event._id || ''}/>}
          publicLink={`/events/${event._id}`}
        />
        <div className="content-area scrollable">
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
           </div>
           <div className="content-right">
             <h2>Invited Participants</h2>
             {participants.length === 0 ? <section>No one invited yet.</section> : null}
             {participants.map((p) => (<EventParticpantEntry key={p._id as React.Key} model={p} />))}
           </div>
        </div>
      </ScrollableLayout>
    );
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private cleanUpEmailAddresses = (invitationEmailAddresses: string[]): string[] => {
    // remove all dupes and null values, trim emails and convert to lower case
    return uniq(invitationEmailAddresses.map((s) => s.toLowerCase().trim())).filter(Boolean);
  }

  private onSubmit = (doc: {invitationEmailAddresses: string[]}) => {
    this.setState({isSaving: true});
    return new Promise((resolve, reject) => {
      Meteor.call('eventParticipants.invite', {
        invitationEmailAddresses: this.cleanUpEmailAddresses(doc.invitationEmailAddresses),
        eventId: this.props.model.event._id,
      }, (error, result) => {
        console.log('eventParticipants.invite', error, result);
        this.setState({isSaving: false});
        if (!error) {
          resolve(true);
        } else {
          reject(error);
        }
      });
    }).then(() => {
      this.formRef.setState({ validate: false });
      this.formRef.change('invitationEmailAddresses', ['']);
    }, (error) => {
      this.formRef.setState({ error });
    });
  }
}

const ReactiveEventParticipantsPage = reactiveSubscriptionById(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(EventParticipantsPage),
  (id) : IPageModel => {
    // TODO: this can be optimized by being smarter about what to query
    const event = Events.findOne(id);
    const participants = event.getParticipants();
    const organization = event.getOrganization();
    return { event, participants, organization };
  }, 'events.by_id', 'eventParticipants.by_eventId', 'organizations.my.private');

export default styled(ReactiveEventParticipantsPage) `
  .content-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .particpant-entry {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    section {
      margin-left: 5px;      
    }

    .particpant-icon img {
      width: 24px;
    }
    .particpant-name {
      flex-grow: 1;
    }
    .particpant-state {

    }
    .particpant-error {

    }
    .participant-remove {
      color: red;
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
`;
