import { EventParticipants } from '../../../both/api/event-participants/event-participants';
import styled from 'styled-components';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import * as React from 'react';
import SimpleSchema from 'simpl-schema';
import { uniq } from 'lodash';

import EventTabs from './EventTabs';
import {IOrganization} from '../../../both/api/organizations/organizations';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';
import {EventParticipantInviteSchema} from '../../../both/api/event-participants/schema';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

const invitationsListSchema = EventParticipantInviteSchema.pick(
  'invitationEmailAddresses', 'invitationEmailAddresses.$');

interface IPageModel {
  event: IEvent;
  organization: IOrganization;
}

class EventParticipantsPage extends React.Component<
    IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public render(): JSX.Element {
    const event = this.props.model.event;
    const organization = this.props.model.organization;

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
          <h2>Invite Participants to event</h2>
          <AutoForm
            placeholder={true}
            showInlineError={true}
            schema={invitationsListSchema}
            submitField={() => (<button className="btn btn-primary">Send invites</button>)}
            onSubmit={this.onSubmit}
           />
        </div>
      </ScrollableLayout>
    );
  }
  private onSubmit = (doc: {invitationEmailAddresses: string[]}) => {
    Meteor.call('eventParticipants.invite', {
      invitationEmailAddresses: uniq(doc.invitationEmailAddresses), // remove all dupes
      eventId: this.props.model.event._id,
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
    // const participants = event
    const organization = event.getOrganization();
    return { event, organization };
  }, 'events.by_id', 'organizations.my.private');

export default styled(ReactiveEventParticipantsPage) `
`;
