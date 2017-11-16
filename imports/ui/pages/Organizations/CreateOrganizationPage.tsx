import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import {browserHistory} from 'react-router';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import AdminHeader from '../../components/AdminHeader';
import {IOrganizationBaseFormProps, OrganizationBaseForm, OrganizationFormHintBox} from './OrganizationBaseForm';
import NoSelectedOrganizationHeader from './NoSelectedOrganizationHeader';

interface ICreateOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToOrganizationPage = (_id: Mongo.ObjectID) => {
  browserHistory.push(`/organizations/${_id}/organize`);
};

const CreateOrganizationPage = (props: ICreateOrganizationFormProps & IStyledComponent) => {
  return (
    <ScrollableLayout id="CreateOrganizationPage" className={props.className}>
      <AdminHeader
        titleComponent={<NoSelectedOrganizationHeader/>}
      />
      <div className="content-area scrollable hsplit">
        <div className="content-left">
          <h2>{t`Create Organization`}</h2>
          <OrganizationBaseForm afterSubmit={GoToOrganizationPage} mode="create"/>
        </div>
        <OrganizationFormHintBox/>
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateOrganizationPage = styled<IOrganizationBaseFormProps>(CreateOrganizationPage) `
`;

export default StyledCreateOrganizationPage;
