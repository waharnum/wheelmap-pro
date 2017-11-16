import styled from 'styled-components';
import * as React from 'react';
import {t} from 'c-3po';
import {browserHistory} from 'react-router';

import AdminTab from '../../components/AdminTab';
import {IStyledComponent} from '../../components/IStyledComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';

import MapLayout from '../../layouts/MapLayout';

import {EventBaseForm, IEventBaseFormProps} from './EventBaseForm';

interface ICreateEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToEventPage = (_id) => {
  browserHistory.push(`/events/${_id}/organize`);
};

const CreateEventPage = (props: ICreateEventFormProps & IStyledComponent) => {
  return (
    <MapLayout id="CreateEventPage" className={props.className}>
      <AdminHeader
        titleComponent={<HeaderTitle title="Create Event"/>}
        tabs={(
          <section>
            <AdminTab to="/" title={t`Dashboard`}/>
            <AdminTab to="" title={t`Create Event`} active={true}/>
          </section>
        )}
      />
      <EventBaseForm afterSubmit={GoToEventPage} mode="create"/>
    </MapLayout>
  );
};

const StyledCreateEventPage = styled<IEventBaseFormProps>(CreateEventPage) `
`;

export default StyledCreateEventPage;
