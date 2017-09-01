import { TAPi18n } from 'meteor/tap:i18n';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import AdminTab from '../../components/AdminTab';
import AdminHeader from '../../components/AdminHeader';
import { IStyledComponent } from '../../components/IStyledComponent';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import EventBaseForm, { IEventBaseFormProps } from './EventBaseForm';

interface ICreateEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToEventPage = (_id) => { browserHistory.push(`/events/${_id}`); };
const CreateEventPage = (props: ICreateEventFormProps & IStyledComponent) => {
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
        <EventBaseForm afterSubmit={GoToEventPage} />
      </div>
    </ScrollableLayout>
  );
};

const StyledCreateEventPage = styled<IEventBaseFormProps>(CreateEventPage) `
`;

export default StyledCreateEventPage;
