import { TAPi18n } from 'meteor/tap:i18n';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import { IStyledComponent } from '../../components/IStyledComponent';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import EventBaseForm, { IEventBaseFormProps } from './EventBaseForm';

interface ICreateOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToOrganizationPage = (_id) => { browserHistory.push(`/organizations/${_id}`); };
const CreateOrganizationPage = (props: ICreateOrganizationFormProps & IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader
        titleComponent={<h1>{TAPi18n.__('Create Event')}</h1>}
        tabs={
          <section>
            <AdminTab to="/" title={TAPi18n.__('Dashboard')}/>
            <AdminTab to="" title={TAPi18n.__('Create')} active={true} />
          </section>
          }
        />
      <div className="content-area scrollable">
        <EventBaseForm afterSubmit={GoToOrganizationPage} />
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateOrganizationPage = styled<IEventBaseFormProps>(CreateOrganizationPage) `
`;

export default StyledCreateOrganizationPage;
