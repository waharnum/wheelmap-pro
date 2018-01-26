import styled from 'styled-components';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {Events, IEvent} from '../../../both/api/events/events';
import {IAsyncDataByIdProps, reactiveSubscriptionByParams} from '../../components/reactiveModelSubscription';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import NewMapLayout from '../../layouts/NewMapLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';


type PageModel = {
  organization: IOrganization;
  event: IEvent;
};

type PageParams = {
  organization_id: string,
  place_id: string | undefined
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowEventPage extends React.Component<Props> {

  public componentWillReceiveProps(nextProps: Props) {
  }

  public render() {
    const {organization} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let additionalMapPanel: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let canDismissSidePanel: boolean = true;

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        additionalMapPanel={additionalMapPanel}
        forceContentToSidePanel={forceContentToSidePanel}
        canDismissSidePanel={canDismissSidePanel}
        searchBarLogo={organization.logo}
        searchBarPrefix={organization.name}
        mapProperties={{}}
      />
    );
  }
};


const ReactiveShowEventPage = reactiveSubscriptionByParams(
  wrapDataComponent<PageModel,
    IAsyncDataByIdProps<PageModel | null>,
    IAsyncDataByIdProps<PageModel>>(ShowEventPage),
  (id): PageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    return event && organization ? {organization, event} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public', 'users.my.private');


export default styled(ReactiveShowEventPage) `
`;
