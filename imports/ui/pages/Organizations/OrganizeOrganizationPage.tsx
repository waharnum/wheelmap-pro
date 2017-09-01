
import * as React from 'react';

import Button from '../../components/Button';
import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IModelProps, reactiveModelSubscriptionById } from '../../components/reactiveModelSubscription';

const DashboardPage = (props: IModelProps<IOrganization> ) => (
  <ScrollableLayout>
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
      <section><Button to="/events/create" className="btn-primary" >Create your first event</Button></section>
    </div>
  </ScrollableLayout>
);

const ReactiveDashboardPage = reactiveModelSubscriptionById(
  wrapDataComponent<IOrganization, IModelProps<IOrganization | null>, IModelProps<IOrganization>>(DashboardPage),
  Organizations, 'organizations.by_id');

export default ReactiveDashboardPage;