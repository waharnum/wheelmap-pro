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
import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';
import PlaceDetailsPanel from '../../panels/PlaceDetailsPanel';
import {Link} from 'react-router';
import {colors} from '../../stylesheets/colors';
import SurveyPanel from './panels/SurveyPanel';


type PageModel = {
  organization: IOrganization;
  event: IEvent;
};

type PageParams = {
  organization_id: string,
  _id: string, // event id,
  place_id: string,
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowEventPage extends React.Component<Props> {

  getPanelContent(isMappingFlow: boolean) {
    const {location, router, params} = this.props;
    const {organization, event} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let forceSidePanelOpen: boolean = false;
    let overlapSidePanelTakeFullWidth: boolean = false;
    let onDismissSidePanel: undefined | (() => void) = undefined;

    if (location.pathname.endsWith('/create-place') || location.pathname.includes('/edit-place/')) {
      content = <SurveyPanel event={event} place={null} onExitSurvey={() => {
        router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping`);
      }}/>;
      header = null;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
      overlapSidePanelTakeFullWidth = true;
    } else if (params.place_id) {
      const target = isMappingFlow ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping` :
        `/new/organizations/${organization._id}/events/${event._id}`;
      // place details
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Place`}/>;
      // TODO async fetch feature
      const feature = accessibilityCloudFeatureCache.getCachedFeature(params.place_id);
      content = <PlaceDetailsPanel feature={feature}/>;
      forceSidePanelOpen = true;
      // TODO center map to POI on first render
    } else if (location.pathname.endsWith('/mapping/user')) {
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
    } else if (location.pathname.endsWith('/organization') ||
      location.pathname.endsWith('/mapping/organization')) {
      const target = isMappingFlow ?
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
    } else if (location.pathname.endsWith('/mapping')) {
      content = <EventPanel event={event}/>;
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/mapping/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      forceContentToSidePanel = true;
    } else {
      content = <EventPanel event={event}/>;
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Event`}/>;
    }
    return {
      content,
      header,
      forceSidePanelOpen,
      forceContentToSidePanel,
      onDismissSidePanel,
      overlapSidePanelTakeFullWidth,
    };
  }

  public render() {
    const {router} = this.props;
    const {organization, event} = this.props.model;

    const isMappingFlow = location.pathname.endsWith('/mapping') ||
      location.pathname.includes('/mapping/');
    const isPlaceDetails = location.pathname.includes('/place/');

    const {
      content, header, forceSidePanelOpen, forceContentToSidePanel, onDismissSidePanel, overlapSidePanelTakeFullWidth,
    } = this.getPanelContent(isMappingFlow);

    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        sidePanelHidden={forceSidePanelOpen ? false : undefined}
        forceContentToSidePanel={forceContentToSidePanel}
        overlapSidePanelTakeFullWidth={overlapSidePanelTakeFullWidth}
        canDismissFromSidePanel={false}
        onDismissSidePanel={onDismissSidePanel}
        canDismissCardPanel={isPlaceDetails}
        onDismissCardPanel={() => {
          if (isMappingFlow) {
            router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping`);
          } else {
            router.push(`/new/organizations/${organization._id}/events/${event._id}`);
          }
        }}
        mapProperties={{
          bbox: isMappingFlow ? undefined : bbox,
          onMarkerClick: (id) => {
            if (isMappingFlow) {
              router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping/place/${id}`);
            } else {
              router.push(`/new/organizations/${organization._id}/events/${event._id}/place/${id}`);
            }
          },
        }}
        mapChildren={isMappingFlow ? (<Link to={{
          pathname: `/new/organizations/${organization._id}/events/${event._id}/mapping/create-place`,
          state: {mapPosition: {}, historyBehavior: 'back'},
        }} className="add-place">+</Link>) : (<EventMiniMarker
          event={event}
          additionalLeafletLayers={[L.rectangle(bbox, {
            className: 'event-bounds-polygon',
            interactive: false,
          })]}
        />)}
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
  a.add-place {
    width: 65px;
    height: 65px;
    position: absolute;
    background-color: ${colors.linkBlue};
    z-index: 10000;
    border-radius: 65px;
    right: 10px;
    bottom: 20px;
    color: white;
    font-size: 35px;
    font-weight: 800;
    text-align: center;
    line-height: 65px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    font-family: 'iconfield-V03';
  }
`;
