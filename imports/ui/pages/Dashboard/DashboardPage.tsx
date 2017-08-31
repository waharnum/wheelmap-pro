import * as React from 'react';

import Button from '../../components/Button';
import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

const DashboardPage = (props) => (
  <ScrollableLayout>

    <AdminHeader
        titleComponent={(
          <OrganizationsDropdown>
            <Button to="/organizations/create" className="btn-primary" >Create Organization</Button>
          </OrganizationsDropdown>
        )}
        tabs={(
          <div>
            <AdminTab to="/dashboard" title="Dashboard" active={true} />
            <AdminTab to="/organization/statistics/ID_HERE" title="Statistics" />
            <AdminTab to="/edit/ID_HERE" title="Customize" />
          </div>
        )}
      />
    <div className="content-area scrollable">
      
      <section>Please create your first organization or wait until you are invited.</section>
      <section><Button to="/organizations/list" className="btn-primary" >All Organizations</Button></section>
    </div>
  </ScrollableLayout>
);

export default DashboardPage;
; ;