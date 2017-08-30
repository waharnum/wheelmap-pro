import * as React from 'react';

import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

const DashboardPage = (props) => (
  <ScrollableLayout>
    <AdminHeader title="Your Dashboard" />    
    <div className="content-area scrollable">
      <OrganizationsDropdown />
      <section>Please create your first organization or wait until you are invited.</section>
      <section><Button to="/organizations/create" className="btn-primary" >Create Organization</Button></section>
      <section><Button to="/organizations/list" className="btn-primary" >All Organizations</Button></section>
    </div>
  </ScrollableLayout>
);

export default DashboardPage;
;