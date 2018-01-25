import styled from 'styled-components';
import * as React from 'react';

import NewMapLayout from '../../layouts/NewMapLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import OrganizationAboutPanel from './panels/OrganizationAboutPanel';

type PageModel = {
  organization: IOrganization;
  events: Array<IEvent>;
};

type PageParams = {
  params: {
    _id: string,
    event_id: string | undefined
    place_id: string | undefined
  }
}

type PageProps = PageParams & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowOrganizationPage extends React.Component<PageProps> {

  public componentWillMount() {
  }

  public componentWillReceiveProps(nextProps) {

  }

  public render() {
    return (
      <NewMapLayout
        className={this.props.className}
        header={null}
        contentPanel={<OrganizationAboutPanel organization={this.props.model.organization}/>}
        mapProperties={{}}
      />
    );
  }
};

const ReactiveShowOrganizationPage = reactiveSubscriptionByParams(
  wrapDataComponent<PageModel,
    IAsyncDataByIdProps<PageModel | null>,
    IAsyncDataByIdProps<PageModel>>(ShowOrganizationPage),
  (id): PageModel | null => {
    const organization = Organizations.findOne(id);
    const events = organization ? organization.getEvents() : null;
    // fetch model with organization & events in one go
    return organization && events ? {organization, events: events || []} : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.public', 'users.my.private');


export default styled(ReactiveShowOrganizationPage) `
`;
