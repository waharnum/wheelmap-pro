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
import UserPanel from '../../panels/UserPanel';
import {t} from 'c-3po';
import EventPreviewPanel from '../Events/panels/EventPreviewPanel';

type PageModel = {
  organization: IOrganization;
  events: Array<IEvent>;
};

type PageParams = {
  _id: string,  // organization id
  place_id: string | undefined
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;
type State = {
  sidePanelDismissed?: boolean,
  additionalCardPanelDismissed: boolean
};

class ShowOrganizationPage extends React.Component<Props, State> {
  state: State = {
    sidePanelDismissed: undefined,
    additionalCardPanelDismissed: false,
  };

  getPanelContent() {
    const {organization, events} = this.props.model;
    const {router, params, location} = this.props;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let additionalMapPanel: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let forceSidePanelOpen: boolean | undefined = undefined;
    let canDismissFromSidePanel: boolean = true;
    let canDismissCardPanel: boolean = false;
    let canDismissAdditionalCardPanel: boolean = false;
    let onDismissSidePanel: undefined | (() => void);
    let onDismissCardPanel: undefined | (() => void);
    let onDismissAdditionalCardPanel: undefined | (() => void);
    if (params.place_id) {
      // place details
      header = <LogoHeader link={`/new/organizations/${organization._id}/about`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Place`}/>;
      // TODO async fetch feature
      const feature = accessibilityCloudFeatureCache.getCachedFeature(params.place_id);
      content = <PlaceDetailsPanel feature={feature}/>;
      canDismissFromSidePanel = false;
      canDismissCardPanel = true;
      forceSidePanelOpen = true;
      // TODO center map to POI on first render
    } else if (location.pathname.endsWith('/user')) {
      // user panel
      header = <LogoHeader link={`/new/organizations/${organization._id}/about`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`My account`}/>;
      content = <UserPanel
        onSignedInHook={() => {
          router.push(`/new/organizations/${organization._id}/about`);
        }}
        onSignedOutHook={() => {
          router.push(`/new/organizations/${organization._id}/about`);
        }}
      />;
      forceContentToSidePanel = true;
      canDismissFromSidePanel = false;
      forceSidePanelOpen = true;
    } else {
      // about organization panel
      content = <OrganizationAboutPanel
        organization={organization}
        onGotoUserPanel={() => {
          router.push(`/new/organizations/${organization._id}/user`);
        }}
      />;
      if (events.length > 0) {
        const event = events[0];
        additionalMapPanel = <EventPreviewPanel event={event} onClickPanel={() => {
          router.push(`/new/organizations/${organization._id}/events/${event._id}`);
        }}/>;
        canDismissAdditionalCardPanel = true;
      }
      forceContentToSidePanel = true;

      if (location.pathname.endsWith('/about')) {
        forceSidePanelOpen = true;
      }
    }

    return {
      content,
      header,
      additionalMapPanel,
      forceContentToSidePanel,
      forceSidePanelOpen,
      canDismissFromSidePanel,
      canDismissCardPanel,
      canDismissAdditionalCardPanel,
      onDismissSidePanel,
      onDismissCardPanel,
      onDismissAdditionalCardPanel,
    };
  }


  public render() {
    const {router, className} = this.props;
    const {organization} = this.props.model;
    const {
      content, header, additionalMapPanel, forceContentToSidePanel, canDismissCardPanel,
      forceSidePanelOpen, canDismissFromSidePanel, canDismissAdditionalCardPanel,
    } = this.getPanelContent();

    return (
      <NewMapLayout
        className={className}
        header={header}
        contentPanel={content}
        additionalMapPanel={this.state.additionalCardPanelDismissed ? null : additionalMapPanel}
        forceContentToSidePanel={forceContentToSidePanel}
        onSearchBarLogoClicked={() => {
          router.push(`/new/organizations/${organization._id}/about`);
        }}
        canDismissFromSidePanel={canDismissFromSidePanel}
        onDismissSidePanel={() => {
          this.setState({sidePanelDismissed: true});
          router.push(`/new/organizations/${organization._id}`);
        }}
        canDismissCardPanel={canDismissCardPanel}
        onDismissCardPanel={() => {
          router.push(`/new/organizations/${organization._id}`);
        }}
        canDismissAdditionalCardPanel={canDismissAdditionalCardPanel}
        onDismissAdditionalCardPanel={() => this.setState({additionalCardPanelDismissed: true})}
        allowSearchBar={true}
        searchBarLogo={organization.logo}
        searchBarPrefix={organization.name}
        sidePanelHidden={forceSidePanelOpen ? false : this.state.sidePanelDismissed}
        mapProperties={{
          onMarkerClick: (id) => {
            router.push(`/new/organizations/${organization._id}/place/${id}`);
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
