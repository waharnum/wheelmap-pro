import { TAPi18n } from 'meteor/tap:i18n';
import styled from 'styled-components';
import * as React from 'react';

import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import { IStyledComponent } from '../../components/IStyledComponent';

import ScrollableLayout from '../../layouts/ScrollableLayout';

const NoOrganizationsPage = (props: IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader titleComponent={<h1>Welcome to $pageName</h1>} />
      <div className="content-area scrollable">
        <div>{TAPi18n.__('It seems you are not part of any organization yet. Please wait for your invite, or create your own organization.')}</div>
        <div><Button className="btn-primary" to="/organizations/create" >{TAPi18n.__('Create Organization')}</Button></div>
      </div>
    </ScrollableLayout>
  );
};

const StyledNoOrganizationsPage = styled(NoOrganizationsPage) `
`;

export default StyledNoOrganizationsPage;
