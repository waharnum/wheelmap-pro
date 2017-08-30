import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import * as React from 'react';

const DashboardPage = (props) => (
  <ScrollableLayout>
    <AdminHeader title="Your Dashboard" />
    <div className="content-area scrollable">
      <section>Please create your first organization or wait until you are invited.</section>
      <Button to="/organizations/create" className="btn-primary" >Create Organization</Button>
    </div>
  </ScrollableLayout>
);

export default DashboardPage;
