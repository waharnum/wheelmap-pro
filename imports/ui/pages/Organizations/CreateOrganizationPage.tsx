import { TAPi18n } from 'meteor/tap:i18n';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import AdminTab from '../../components/AdminTab';
import { IStyledComponent } from '../../components/IStyledComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import OrganizationBaseForm, { IOrganizationBaseFormProps } from './OrganizationBaseForm';

interface ICreateOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToOrganizationPage = (_id) => { browserHistory.push(`/organizations/${_id}`); };
const CreateOrganizationPage = (props: ICreateOrganizationFormProps & IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader
        titleComponent={<HeaderTitle title="Create Organization" />}
        tabs={(
          <section>
            <AdminTab to="/" title={TAPi18n.__('Dashboard')}/>
            <AdminTab to="" title={TAPi18n.__('Create')} active={true} />
          </section>
        )}
        />
      <div className="content-area scrollable">
        <OrganizationBaseForm afterSubmit={GoToOrganizationPage} />
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateOrganizationPage = styled<IOrganizationBaseFormProps>(CreateOrganizationPage) `
`;

export default StyledCreateOrganizationPage;
