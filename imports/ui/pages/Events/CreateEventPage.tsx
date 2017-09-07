import styled from 'styled-components';
import * as React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import { browserHistory } from 'react-router';

import AdminTab from '../../components/AdminTab';
import { IStyledComponent } from '../../components/IStyledComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import EventBaseForm, { IEventBaseFormProps } from './EventBaseForm';

interface ICreateEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToEventPage = (_id) => { browserHistory.push(`/events/${_id}/organize`); };

const CreateEventPage = (props: ICreateEventFormProps & IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader
        titleComponent={<HeaderTitle title="Create Event" />}
        tabs={(
          <section>
            <AdminTab to="/" title={TAPi18n.__('Dashboard')}/>
            <AdminTab to="" title={TAPi18n.__('Create')} active={true} />
          </section>
        )}
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
