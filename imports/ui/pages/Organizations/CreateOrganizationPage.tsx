import * as React from 'react';
import styled from 'styled-components';

import OrganizationBaseForm, { IBaseFormProps } from './OrganizationBaseForm';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';

const CreateOrganizationPage = (props: IBaseFormProps) => {
  return (
    <ScrollableLayout>
      <AdminHeader title="Create Organization" /> 
      <div className="content-area scrollable">
      <OrganizationBaseForm  {...props} />
      </div>
    </ScrollableLayout>
  );
};

export default styled<IBaseFormProps>(CreateOrganizationPage) `
`;
