import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IStyledComponent } from '../../components/IStyledComponent';
import OrganizationBaseForm, { IBaseFormProps } from './OrganizationBaseForm';

interface ICreateOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const CreateOrganizationPage = (props: ICreateOrganizationFormProps & IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader titleComponent={<h1>Create Organization</h1>} />
      <div className="content-area scrollable">
        <OrganizationBaseForm
          afterSubmit={(_id) => { browserHistory.push(`/organizations/${_id}`); }} />
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateOrganizationPage = styled<IBaseFormProps>(CreateOrganizationPage) `
`;

export default StyledCreateOrganizationPage;
;