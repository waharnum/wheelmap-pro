import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import { IStyledComponent } from '../../components/IStyledComponent';

import ScrollableLayout from '../../layouts/ScrollableLayout';

const NoOrganizationsPage = (props: IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className} id="NoOrganizationsPage">
      <AdminHeader titleComponent={<h1>Welcome to $pageName</h1>} />
      <div className="content-area scrollable">
        <div>{t`It seems you are not part of any organization yet. Please wait for your invite, or create your own organization.`}</div>
        <div><Button className="btn-primary" to="/organizations/create" >{t`Create Organization`}</Button></div>
      </div>
    </ScrollableLayout>
  );
};

const StyledNoOrganizationsPage = styled(NoOrganizationsPage) `
`;

export default StyledNoOrganizationsPage;
