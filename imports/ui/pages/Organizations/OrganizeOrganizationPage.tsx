
import * as React from 'react';

import Button from '../../components/Button';
import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { getActiveOrganization, IOrganization } from '../../../both/api/organizations/organizations';
import { IModelProps, reactiveSubscription, IAsyncDataProps } from '../../components/reactiveModelSubscription';

const DashboardPage = (props: IAsyncDataProps<IOrganization> ) => (
  <ScrollableLayout>
    <AdminHeader
        titleComponent={(
          <OrganizationsDropdown current={props.model} >
            <Button to="/organizations/create" className="btn-primary" >Create Organization</Button>
          </OrganizationsDropdown>
        )}
        tabs={(
          <div>
            <AdminTab to="/dashboard" title="Dashboard" active={true} />
            <AdminTab to={`/organizations/statistics/${props.model._id}`} title="Statistics" />
            <AdminTab to={`/organizations/edit/${props.model._id}`} title="Customize" />
          </div>
        )}
    />
    <div className="content-area scrollable">
      <section><Button to="/events/create" className="btn-primary" >Create your first event</Button></section>
    </div>
  </ScrollableLayout>
);

const ReactiveDashboardPage = reactiveSubscription(wrapDataComponent(DashboardPage), () => {
    const org = getActiveOrganization(Meteor.userId());
    return org;
  }, 'organizations.my.active.private', 'organizationMembers.public', 'users.public');

export default ReactiveDashboardPage;