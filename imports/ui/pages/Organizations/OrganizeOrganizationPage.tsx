
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import Button from '../../components/Button';
import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';
import { IModelProps, reactiveModelSubscriptionById } from '../../components/reactiveModelSubscription';

import { IEvent } from '../../../both/api/events/events';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';

const EventListEntry = (props: {model: IEvent}) => (
  <div className="event-list-entry">
    <h3>{props.model.name}</h3>
    <div>{moment(props.model.startTime).format()}</div>
    <div>{props.model.region}</div>
    <div>{moment(props.model.startTime).diff(moment(), 'days')} Days Left</div>
    <Button to={`/events/${props.model._id}`}>Show details</Button>
  </div>
);

const EventList = (props: {model: IEvent[]}) => (
  <div>
    {props.model.map((event) => (
      <EventListEntry key={event._id as React.Key} model={event} />
    ))}
  </div>
);

const OrganizeOrganisationsPage = (props: IStyledComponent & IModelProps<IOrganization> ) => (
  <ScrollableLayout className={props.className}>
    <AdminHeader
        titleComponent={(
          <OrganizationsDropdown current={props.model} >
            <Button to="/organizations/create" className="btn-primary" >Create Organization</Button>
          </OrganizationsDropdown>
        )}
        tabs={(
          <div>
            <AdminTab to="" title="Dashboard" active={true} />
            <AdminTab to={`/organizations/statistics/${props.model._id}`} title="Statistics" />
            <AdminTab to={`/organizations/${props.model._id}/edit`} title="Customize" />
            <AdminTab to={`/organizations/${props.model._id}/members`} title="Members" />
          </div>
        )}
        publicLink={`/organizations/${props.model._id}`}
    />
    <div className="content-area scrollable">
      <EventList model={props.model.getEvents()} />
      <section>
        <Button to="/events/create" className="btn-primary" >Create event</Button>
      </section>
    </div>
  </ScrollableLayout>
);

const ReactiveOrganizeOrganisationsPage = reactiveModelSubscriptionById(
  wrapDataComponent<IOrganization, IModelProps<IOrganization | null>,
                                   IModelProps<IOrganization>>(OrganizeOrganisationsPage),
  Organizations, 'organizations.by_id', 'events.by_organizationId');

const StyledReactiveOrganizeOrganisationsPage = styled(ReactiveOrganizeOrganisationsPage)`
  .event-list-entry {
    width: 100%;
    height: 140px;
    background: #FFF;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .event-list-entry h3 {
    margin-top: 0px;
  }
`;

export default StyledReactiveOrganizeOrganisationsPage;