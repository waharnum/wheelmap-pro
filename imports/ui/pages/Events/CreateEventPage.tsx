import styled from 'styled-components';
import * as React from 'react';
import {t} from 'c-3po';
import {browserHistory} from 'react-router';
import {Meteor} from 'meteor/meteor';

import AdminTab from '../../components/AdminTab';
import {IStyledComponent} from '../../components/IStyledComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';

import MapLayout from '../../layouts/MapLayout';

import {EventBaseForm, IEventBaseFormProps} from './EventBaseForm';
import {getActiveOrganizationId, IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {
  IAsyncDataByIdProps, IAsyncDataProps, reactiveSubscription,
  reactiveSubscriptionByParams,
} from '../../components/reactiveModelSubscription';
import {wrapDataComponent} from '../../components/AsyncDataComponent';

interface ICreateEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

const GoToEventPage = (_id) => {
  browserHistory.push(`/events/${_id}/organize`);
};

const CreateEventPage = (props: ICreateEventFormProps & IStyledComponent & IAsyncDataProps<IOrganization>) => {
  return (
    <MapLayout id="CreateEventPage" className={props.className}>
      <AdminHeader
        titleComponent={<HeaderTitle title="Create Event"
                                     prefixTitle={props.model.name}
                                     logo={props.model.logo}
                                     prefixLink={`/organizations/${props.model._id}/organize`}/>}
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

const CreateEventPageContainer = reactiveSubscription(
  wrapDataComponent<IOrganization,
    IAsyncDataProps<IOrganization | null>,
    IAsyncDataProps<IOrganization>>(CreateEventPage),
  (): IOrganization | null => {
    const userId = Meteor.userId() as any as Mongo.ObjectID;
    const activeOrganization = getActiveOrganizationId(userId);
    return activeOrganization ? Organizations.findOne(activeOrganization) : null;
  },
  'users.my.private', 'organizations.my.private');


const StyledCreateEventPage = styled(CreateEventPageContainer) `
`;

export default StyledCreateEventPage;
