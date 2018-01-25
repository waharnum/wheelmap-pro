import styled from 'styled-components';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';

import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';

import NewMapLayout from '../../layouts/NewMapLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import OrganizationAboutPanel from './panels/OrganizationAboutPanel';
import PlaceDetailsPanel from '../../panels/PlaceDetailsPanel';
import LogoHeader from '../../components/LogoHeader';

type PageModel = {
  organization: IOrganization;
  events: Array<IEvent>;
};

type PageParams = {
  organization_id: string,
  place_id: string | undefined
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowOrganizationPage extends React.Component<Props> {


  public componentWillReceiveProps(nextProps: Props) {
  }

  public render() {
    const {organization} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    if (this.props.params.place_id) {
      // TODO get category of feature
      header = <LogoHeader link={`/new/organizations/${organization._id}`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title="Restaurant"/>;
      // TODO async fetch feature
      const feature = accessibilityCloudFeatureCache.getCachedFeature(this.props.params.place_id);
      content = <PlaceDetailsPanel feature={feature}/>;
    } else {
      content = <OrganizationAboutPanel organization={organization}/>;
    }

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        mapProperties={{
          onMarkerClick: (id) => {
            this.props.router.push(`/new/organizations/${organization._id}/place/${id}`);
          },
        }}
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
