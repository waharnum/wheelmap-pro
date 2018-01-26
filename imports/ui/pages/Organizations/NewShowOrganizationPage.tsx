import styled from 'styled-components';
import * as React from 'react';
import {InjectedRouter, RouteComponentProps} from 'react-router';

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
import UserPanel from '../../panels/UserPanel';
import browserHistory from 'react-router/lib/browserHistory';
import {t} from 'c-3po';

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
    const {organization, events} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let additionalMapPanel: React.ReactNode = null;
    let forceSidePanelForMobile: boolean = false;
    if (this.props.params.place_id) {
      header = <LogoHeader link={`/new/organizations/${organization._id}`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Place`}/>;
      // TODO async fetch feature
      const feature = accessibilityCloudFeatureCache.getCachedFeature(this.props.params.place_id);
      content = <PlaceDetailsPanel feature={feature}/>;
      // TODO center map to POI on first render
    } else if (this.props.location.pathname.endsWith('/user')) {
      header = <LogoHeader link={`/new/organizations/${organization._id}`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`My account`}/>;
      content = <UserPanel
        onSignedInHook={() => {
          this.props.router.push(`/new/organizations/${organization._id}`);
        }}
        onSignedOutHook={() => {
          this.props.router.push(`/new/organizations/${organization._id}`);
        }
        }
      />;
    forceSidePanelForMobile = true;
    } else {
      content = <OrganizationAboutPanel
        organization={organization}
        onGotoUserPanel={() => {
          this.props.router.push(`/new/organizations/${organization._id}/user`);
        }}
      />;
      if (events.length > 0) {
        const event = events[0];
        additionalMapPanel = <section>{event.name}</section>;
      }
      forceSidePanelForMobile = true;
    }

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        additionalMapPanel={additionalMapPanel}
        forceSidePanelForMobile={forceSidePanelForMobile}
        searchBarLogo={organization.logo}
        searchBarPrefix={organization.name}
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
