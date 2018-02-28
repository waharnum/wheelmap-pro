import {t} from 'c-3po';
import * as L from 'leaflet';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import * as React from 'react';
import {Link, RouteComponentProps, InjectedRouter} from 'react-router';

import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';

import {IPlaceInfo} from '../../../both/api/place-infos/place-infos';
import {IOrganization} from '../../../both/api/organizations/organizations';
import {defaultRegion} from '../../../both/api/events/schema';
import {Events, IEvent} from '../../../both/api/events/events';
import {EventParticipants, IEventParticipant} from '../../../both/api/event-participants/event-participants';

import {regionToBbox} from '../../../both/lib/geo-bounding-box';

import {colors} from '../../stylesheets/colors';
import NewMapLayout from '../../layouts/NewMapLayout';

import LogoHeader from '../../components/LogoHeader';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Loading, wrapDataComponent} from '../../components/AsyncDataComponent';
import {IAsyncDataByIdProps, reactiveSubscriptionByParams} from '../../components/reactiveModelSubscription';

import UserPanel from '../../panels/UserPanel';
import EventPanel from './panels/EventPanel';
import SurveyPanel from './panels/SurveyPanel';
import PlaceDetailsPanel from '../../panels/PlaceDetailsPanel';
import EventInvitationPanel from './panels/EventInvitationPanel';
import OrganizationAboutPanel from '../Organizations/panels/OrganizationAboutPanel';

import EventMiniMarker from './EventMiniMarker';
import {PlaceInfoSchema} from '@sozialhelden/ac-format';

const EditPlaceAction = (router: InjectedRouter, organization: IOrganization, event: IEvent, feature: IPlaceInfo) => {
  return (<button className="btn btn-primary" onClick={() => {
    let clonedFeature = Object.assign({}, feature);
    // wheelmap react requires an _id in properties, db does not want this, so lets remove it
    const {_id, ...properties} = clonedFeature.properties;
    clonedFeature.properties = properties;

    if (clonedFeature._id && clonedFeature.properties && clonedFeature.properties.eventId === event._id) {
      // was part of this event/source, just edit right away
      router.push({
        pathname: `/organizations/${organization._id}/events/${event._id}/mapping/edit-place/${clonedFeature._id}`,
        state: {feature: clonedFeature},
      });
    } else {
      // was part of another event/source, needs clean up
      // remove id, so place is saved as a new place!
      delete clonedFeature._id;
      // remove all invalid fields
      clonedFeature = PlaceInfoSchema.clean(clonedFeature);
      // flip lat & lon
      clonedFeature.geometry = Object.assign({}, clonedFeature.geometry);
      router.push({
        pathname: `/organizations/${organization._id}/events/${event._id}/mapping/create-place`,
        state: {feature: clonedFeature},
      });
    }

  }}>{t`Edit place`}</button>);
};

type PageModel = {
  organization: IOrganization,
  event: IEvent,
  user: Meteor.User | null,
  participant: IEventParticipant | null,
  places: IPlaceInfo[],
};

type PageParams = {
  organization_id: string,
  _id: string, // event id,
  place_id?: string,
  token?: string,
};

type Props = RouteComponentProps<PageParams, {}> & IAsyncDataByIdProps<PageModel> & IStyledComponent;

class ShowEventPage extends React.Component<Props> {
  private mapOptions: undefined | { zoom: number; lat: number; lon: number; bbox: L.LatLngBounds };

  constructor(props: Props) {
    super(props);
    ShowEventPage.handleInvalidData(props);
    this.setMapOptions(props);
  }

  componentWillReceiveProps(props: Props) {
    ShowEventPage.handleInvalidData(props);
  }

  static handleInvalidData(props: Props) {
    const {router, location} = props;
    const {participant, event, organization} = props.model;

    const isMappingFlow = location.pathname.endsWith('/mapping') || location.pathname.includes('/mapping/');
    if (isMappingFlow && (!participant || event.status !== 'ongoing')) {
      return router.replace(`/organizations/${organization._id}/events/${event._id}`);
    }
  }

  setMapOptions = (props: Props) => {
    const {event} = this.props.model;
    const bbox = regionToBbox(event.region || defaultRegion);
    const center = bbox.getCenter();
    this.mapOptions = {
      zoom: 8,
      lat: center.lat,
      lon: center.lng,
      bbox,
    };
  };

  getPanelContent(isMappingFlow: boolean) {
    const {location, router, params} = this.props;
    const {organization, event, user, participant} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let forceSidePanelOpen: boolean = false;
    let overlapSidePanelTakeFullWidth: boolean = false;
    let onDismissSidePanel: undefined | (() => void) = undefined;
    let canDismissFromSidePanel: boolean = false;
    let canDismissCardPanel: boolean = false;
    let hideContentFromCardPanel: boolean = false;

    if (location.pathname.endsWith('/create-place') ||
      location.pathname.includes('/edit-place/')) {
      // survey
      const place = (location.state && location.state.feature as IPlaceInfo) || null;

      content = <SurveyPanel event={event} place={place} initialPosition={this.mapOptions} onExitSurvey={() => {
        router.push(`/organizations/${organization._id}/events/${event._id}/mapping`);
      }}/>;
      header = null;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
      overlapSidePanelTakeFullWidth = true;
    } else if (params.place_id) {
      // place details
      const target = isMappingFlow ?
        `/organizations/${organization._id}/events/${event._id}/mapping` :
        `/organizations/${organization._id}/events/${event._id}`;

      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Place`}/>;

      const actions = (feature: IPlaceInfo) => (isMappingFlow && feature) ? EditPlaceAction(router, organization, event, feature) : null;
      content = <PlaceDetailsPanel featureId={params.place_id} actions={actions}/>;
      forceSidePanelOpen = true;
      canDismissCardPanel = true;
      // TODO center map to POI on first render
    } else if (params.token && (
        location.pathname.includes('/public-invitation/') ||
        location.pathname.includes('/private-invitation/'))) {
      // public-invitation
      header = <LogoHeader link={`/organizations/${organization._id}/events/${event._id}`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      content =
        <EventInvitationPanel user={user}
                              event={event}
                              organization={organization}
                              token={params.token}
                              participant={participant}
                              privateInvite={location.pathname.includes('/private-invitation/')}
                              onJoinedEvent={() => {
                                router.push(`/organizations/${organization._id}/events/${event._id}/mapping`);
                              }}/>;
      forceSidePanelOpen = true;
      forceContentToSidePanel = true;
      onDismissSidePanel = () => {
        router.push(`/organizations/${organization._id}/events/${event._id}`);
      };
    } else if (location.pathname.endsWith('/user')) {
      // user panel
      const target = isMappingFlow ?
        `/organizations/${organization._id}/events/${event._id}/mapping` :
        `/organizations/${organization._id}/events/${event._id}`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`My account`}/>;
      content = <UserPanel
        onSignedInHook={() => {
          router.push(target);
        }}
        onSignedOutHook={() => {
          router.push(`/organizations/${organization._id}/events/${event._id}`);
        }}
      />;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
    } else if (location.pathname.endsWith('/organization') ||
      // about-organization
      location.pathname.endsWith('/mapping/organization')) {
      const target = isMappingFlow ?
        `/organizations/${organization._id}/events/${event._id}/mapping` :
        `/organizations/${organization._id}/events/${event._id}`;
      const userTarget = isMappingFlow ?
        `/organizations/${organization._id}/events/${event._id}/mapping/user` :
        `/organizations/${organization._id}/events/${event._id}/user`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      canDismissFromSidePanel = true;
      header = null;

      const adminLink = event.editableBy(Meteor.userId()) ?
        `/events/${event._id}/organize` : undefined;
      content = <OrganizationAboutPanel organization={organization}
                                        adminLink={adminLink}
                                        organizationLink={`/organizations/${organization._id}`}
                                        onGotoUserPanel={
                                          () => {
                                            router.push(userTarget);
                                          }
                                        }/>;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
    } else if (location.pathname.endsWith('/mapping')) {
      // mapping flow
      content = <EventPanel participant={participant} user={user} event={event} showActions={false}/>;
      header = <LogoHeader link={`/organizations/${organization._id}/events/${event._id}/mapping/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}>
        <Link className="event-info"
              to={`/organizations/${organization._id}/events/${event._id}/mapping/event-info`}></Link>
      </LogoHeader>;
      forceSidePanelOpen = true;
      hideContentFromCardPanel = true;
    } else if (location.pathname.endsWith('/event-info')) {
      // event info while mapping
      const target = `/organizations/${organization._id}/events/${event._id}/mapping`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      content = <EventPanel participant={participant} user={user} event={event} showActions={false}/>;
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Event`}/>;
      forceContentToSidePanel = false;
      canDismissCardPanel = true;
    } else {
      // default view
      content = <EventPanel participant={participant} user={user} event={event}/>;
      header = <LogoHeader link={`/organizations/${organization._id}/events/${event._id}/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Event`}/>;
    }
    return {
      content,
      header,
      canDismissCardPanel,
      forceSidePanelOpen,
      forceContentToSidePanel,
      onDismissSidePanel,
      overlapSidePanelTakeFullWidth,
      canDismissFromSidePanel,
      hideContentFromCardPanel,
    };
  }

  public render() {
    const {router, location} = this.props;
    const {organization, event, places} = this.props.model;

    const isMappingFlow = location.pathname.endsWith('/mapping') ||
      location.pathname.includes('/mapping/');

    const {
      content, header, forceSidePanelOpen, forceContentToSidePanel, canDismissFromSidePanel,
      onDismissSidePanel, overlapSidePanelTakeFullWidth, canDismissCardPanel, hideContentFromCardPanel,
    } = this.getPanelContent(isMappingFlow);

    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        hideContentFromCardPanel={hideContentFromCardPanel}
        sidePanelHidden={forceSidePanelOpen ? false : undefined}
        forceContentToSidePanel={forceContentToSidePanel}
        overlapSidePanelTakeFullWidth={overlapSidePanelTakeFullWidth}
        canDismissFromSidePanel={canDismissFromSidePanel}
        onDismissSidePanel={onDismissSidePanel}
        canDismissCardPanel={canDismissCardPanel}
        onDismissCardPanel={() => {
          if (isMappingFlow) {
            router.push(`/organizations/${organization._id}/events/${event._id}/mapping`);
          } else {
            router.push(`/organizations/${organization._id}/events/${event._id}`);
          }
        }}
        mapProperties={{
          customPlaces: places,
          bbox: bbox,
          onMarkerClick: (id) => {
            if (isMappingFlow) {
              router.push(`/organizations/${organization._id}/events/${event._id}/mapping/place/${id}`);
            } else {
              router.push(`/organizations/${organization._id}/events/${event._id}/place/${id}`);
            }
          },
          onMoveEnd: (options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => {
            this.mapOptions = options;
          },
        }}
        mapChildren={isMappingFlow ? (<Link to={{
          pathname: `/organizations/${organization._id}/events/${event._id}/mapping/create-place`,
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
    const user = Meteor.user();
    const participant = user ? EventParticipants.findOne({userId: user._id, eventId: id}) : null;
    const places = event ? event.getPlaces() : [];
    // fetch model with organization & events in one go
    return event && organization ? {organization, event, user, participant, places} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public',
  'eventParticipants.my_byEventId.private', 'placeInfos.by_eventId.public', 'users.my.private');


export default styled(ReactiveShowEventPage) `  
  a.add-place {
    width: 65px;
    height: 65px;
    position: absolute;
    background-color: ${colors.linkBlue};
    z-index: 400; /* above map but below CardPanel */
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
  
  a.event-info {
    font-size: 30px;
    font-family: 'iconfield-V03';
  }
  
  &.fixed-side-panel {
    a.event-info {
      display: none;
    }
  }
`;
