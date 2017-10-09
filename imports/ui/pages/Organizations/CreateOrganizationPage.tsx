import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import {browserHistory} from 'react-router';

import AdminTab from '../../components/AdminTab';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {IOrganizationBaseFormProps, OrganizationBaseForm, OrganizationFormHintBox} from './OrganizationBaseForm';

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
        titleComponent={<HeaderTitle title="Create Organization"/>}
        tabs={(
          <section>
            <AdminTab to="/" title={t`Dashboard`}/>
            <AdminTab to="" title={t`Create`} active={true}/>
          </section>
        )}
      />
      <div className="content-area scrollable hsplit">
        <OrganizationBaseForm afterSubmit={GoToOrganizationPage} mode="create"/>
        <OrganizationFormHintBox/>
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateOrganizationPage = styled<IOrganizationBaseFormProps>(CreateOrganizationPage) `
`;

export default StyledCreateOrganizationPage;
