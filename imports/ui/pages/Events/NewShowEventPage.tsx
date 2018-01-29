import styled from 'styled-components';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {Events, IEvent} from '../../../both/api/events/events';
import {IAsyncDataByIdProps, reactiveSubscriptionByParams} from '../../components/reactiveModelSubscription';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import NewMapLayout from '../../layouts/NewMapLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';
import EventPanel from './panels/EventPanel';
import {t} from 'c-3po';
import LogoHeader from '../../components/LogoHeader';
import {defaultRegion} from '../../../both/api/events/schema';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import * as L from 'leaflet';
import EventMiniMarker from './EventMiniMarker';
import UserPanel from '../../panels/UserPanel';
import OrganizationAboutPanel from '../Organizations/panels/OrganizationAboutPanel';


type PageModel = {
  organization: IOrganization;
  event: IEvent;
};

type PageParams = {
  organization_id: string,
  _id: string, // event id
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowEventPage extends React.Component<Props> {

  getPanelContent() {
    const {location, router} = this.props;
    const {organization, event} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let canDismissFromSidePanel: boolean = true;
    let forceSidePanelOpen: boolean = false;
    let onDismissSidePanel: undefined | (() => void) = undefined;

    if (location.pathname.endsWith('/mapping/user')) {
      const target = `/new/organizations/${organization._id}/events/${event._id}/mapping`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      // user panel
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      content = <UserPanel
        onSignedOutHook={() => {
          router.push(`/new/organizations/${organization._id}/events/${event._id}`);
        }}
      />;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
      canDismissFromSidePanel = false;
    } else if (location.pathname.endsWith('/organization') || location.pathname.endsWith('/mapping/organization')) {
      const target = location.pathname.endsWith('/mapping/organization') ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping` :
        `/new/organizations/${organization._id}/events/${event._id}`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      // user panel
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      content = <OrganizationAboutPanel organization={organization} onGotoUserPanel={
        () => {
          router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping/user`);
        }
      }/>;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
      canDismissFromSidePanel = false;
    } else if (location.pathname.endsWith('/mapping')) {
      content = <EventPanel event={event}/>;
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/mapping/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      forceContentToSidePanel = true;
      canDismissFromSidePanel = false;
    } else {
      content = <EventPanel event={event}/>;
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Event`}/>;
      canDismissFromSidePanel = false;
    }
    return {
      content,
      header,
      forceSidePanelOpen,
      forceContentToSidePanel,
      canDismissFromSidePanel,
      onDismissSidePanel,
    };
  }

  public render() {
    const {organization, event} = this.props.model;
    const {
      content, header, forceSidePanelOpen, forceContentToSidePanel,
      canDismissFromSidePanel, onDismissSidePanel,
    } = this.getPanelContent();

    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        sidePanelHidden={forceSidePanelOpen ? false : undefined}
        forceContentToSidePanel={forceContentToSidePanel}
        canDismissFromSidePanel={canDismissFromSidePanel}
        onDismissSidePanel={onDismissSidePanel}
        searchBarLogo={organization.logo}
        searchBarPrefix={organization.name}
        mapProperties={{
          bbox,
        }}
        mapChildren={<EventMiniMarker
          event={event}
          additionalLeafletLayers={[L.rectangle(bbox, {
            className: 'event-bounds-polygon',
            interactive: false,
          })]}
        />}
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
