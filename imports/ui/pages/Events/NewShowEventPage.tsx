import styled from 'styled-components';
import * as React from 'react';
import {Redirect, Link, RouteComponentProps} from 'react-router';

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
import {colors} from '../../stylesheets/colors';
import SurveyPanel from './panels/SurveyPanel';
import EventInvitationPanel from './panels/EventInvitationPanel';
import {EventParticipants, IEventParticipant} from '../../../both/api/event-participants/event-participants';
import {IPlaceInfo} from '../../../both/api/place-infos/place-infos';


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

  constructor(props: Props) {
    super(props);
    this.handleInvalidData(props);
  }

  componentWillReceiveProps(props: Props) {
    this.handleInvalidData(props);
  }

  handleInvalidData(props: Props) {
    const {router, location} = props;
    const {participant, event, organization} = props.model;

    const isMappingFlow = location.pathname.endsWith('/mapping') || location.pathname.includes('/mapping/');
    if (isMappingFlow && (!participant || event.status !== 'ongoing')) {
      return router.replace(`/new/organizations/${organization._id}/events/${event._id}`);
    }
  }

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

    if (location.pathname.endsWith('/create-place') || location.pathname.includes('/edit-place/')) {
      // survey
      content = <SurveyPanel event={event} place={null} onExitSurvey={() => {
        router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping`);
      }}/>;
      header = null;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
      overlapSidePanelTakeFullWidth = true;
    } else if (params.place_id) {
      // place details
      const target = isMappingFlow ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping` :
        `/new/organizations/${organization._id}/events/${event._id}`;
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={t`Place`}/>;
      // TODO async fetch feature
      const feature = accessibilityCloudFeatureCache.getCachedFeature(params.place_id);
      content = <PlaceDetailsPanel feature={feature}/>;
      forceSidePanelOpen = true;
      canDismissCardPanel = true;
      // TODO center map to POI on first render
    } else if (params.token && (
        location.pathname.includes('/public-invitation/') ||
        location.pathname.includes('/private-invitation/'))) {
      // public-invitation
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}`}
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
                                router.push(`/new/organizations/${organization._id}/events/${event._id}/mapping`);
                              }}/>;
      forceSidePanelOpen = true;
      forceContentToSidePanel = true;
      onDismissSidePanel = () => {
        router.push(`/new/organizations/${organization._id}/events/${event._id}`);
      };
    } else if (location.pathname.endsWith('/user')) {
      // user panel
      const target = isMappingFlow ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping` :
        `/new/organizations/${organization._id}/events/${event._id}`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      header = <LogoHeader link={target}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}/>;
      content = <UserPanel
        onSignedInHook={() => {
          router.push(target);
        }}
        onSignedOutHook={() => {
          router.push(`/new/organizations/${organization._id}/events/${event._id}`);
        }}
      />;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
    } else if (location.pathname.endsWith('/organization') ||
      // about-organization
      location.pathname.endsWith('/mapping/organization')) {
      const target = isMappingFlow ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping` :
        `/new/organizations/${organization._id}/events/${event._id}`;
      const userTarget = isMappingFlow ?
        `/new/organizations/${organization._id}/events/${event._id}/mapping/user` :
        `/new/organizations/${organization._id}/events/${event._id}/user`;
      onDismissSidePanel = () => {
        router.push(target);
      };
      canDismissFromSidePanel = true;
      header = null;

      const adminLink = event.editableBy(Meteor.userId()) ?
        `/events/${event._id}/organize` : undefined;
      content = <OrganizationAboutPanel organization={organization}
                                        adminLink={adminLink}
                                        organizationLink={`/new/organizations/${organization._id}`}
                                        onGotoUserPanel={
                                          () => {
                                            router.push(userTarget);
                                          }
                                        }/>;
      forceContentToSidePanel = true;
      forceSidePanelOpen = true;
    } else if (location.pathname.endsWith('/mapping')) {
      // mapping flow
      content = <EventPanel participant={participant} user={user} event={event}/>;
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/mapping/organization`}
                           prefixTitle={organization.name}
                           logo={organization.logo}
                           title={event.name}>
        <Link className="event-info"
              to={`/new/organizations/${organization._id}/events/${event._id}/mapping/event-info`}></Link>
      </LogoHeader>;
      forceSidePanelOpen = true;
      hideContentFromCardPanel = true;
    } else if (location.pathname.endsWith('/event-info')) {
      // event info while mapping
      const target = `/new/organizations/${organization._id}/events/${event._id}/mapping`;
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
      header = <LogoHeader link={`/new/organizations/${organization._id}/events/${event._id}/organization`}
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
    const {organization, event} = this.props.model;

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
