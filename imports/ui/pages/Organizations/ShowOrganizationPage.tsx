import { t } from 'c-3po';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { browserHistory } from 'react-router';

import { accessibilityCloudFeatureCache } from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';

import Map from '../../components/Map';
import MapLayout from '../../layouts/MapLayout';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { reactiveSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

import { IEvent } from '../../../both/api/events/events';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';
import { regionToBbox } from '../../../both/lib/geo-bounding-box';
import EventMiniMarker from '../Events/EventMiniMarker';
import EventMapPopup from '../Events/EventMapPopup';
import { defaultRegion } from '../../../both/api/events/schema';
import { IPlaceInfo } from '../../../both/api/place-infos/place-infos';
import PlaceDetailsContainer from '../../components/PlaceDetailsContainer';

interface IPageModel {
  organization: IOrganization;
  events: Array<IEvent>;
}

type PageParams = {
  params: {
    _id: string,
    event_id: string | undefined
    place_id: string | undefined
  }
}
type PageProps = PageParams & IAsyncDataByIdProps<IPageModel> & IStyledComponent;

class ShowOrganizationPage extends React.Component<PageProps> {
  ignoreMapMovement: boolean;
  state: {
    selectedPlace: IPlaceInfo | null,
    mapWasMovedManually: false,
  } = {
      selectedPlace: null,
      mapWasMovedManually: false,
    };

  public componentWillMount() {
    this.redirectToCorrectRoute(this.props, true);
  }

  public componentWillReceiveProps(nextProps) {
    if (this.props.params.event_id !== nextProps.params.event_id ||
      this.props.params.place_id !== nextProps.params.place_id) {
      this.ignoreMapMovement = true;
      this.redirectToCorrectRoute(nextProps, false);
      this.setState({ mapWasMovedManually: false }, () => {
        this.ignoreMapMovement = false;
      });
    }
  }

  public render() {
    const organization = this.props.model.organization;
    const events = this.props.model.events;

    let eventIndex = 0;
    let selectedEvent, nextEvent, prevEvent;

    if (this.props.params.event_id) {
      eventIndex = events.findIndex((e) => {
        return e._id == this.props.params.event_id;
      });
      selectedEvent = events[eventIndex];
      nextEvent = events[(eventIndex + 1) % events.length];
      prevEvent = events[(eventIndex + events.length - 1) % events.length];
    }

    return (
      <MapLayout className={this.props.className}>
        <PublicHeader
          titleComponent={(
            <HeaderTitle
              title={organization.name}
              logo={organization.logo}
              description={organization.description}
            />
          )}
          organizeLink={organization.editableBy(Meteor.userId()) ? `/organizations/${organization._id}/organize` : undefined}
        />
        <div className="content-area">
          <Map
            {...this.determineMapPosition(selectedEvent, this.state.selectedPlace) }
            onBboxApplied={this.onMapBboxApplied}
            onMoveEnd={this.onMapMoveEnd}
            onMarkerClick={this.onMarkerClick}
            selectedPlace={this.state.selectedPlace}
          >
            {events.map((event: IEvent) => {
              if (selectedEvent && event._id === selectedEvent._id) {
                return (<EventMapPopup event={event}
                  key={String(event._id)}
                  primaryAction={event.status === 'ongoing' || event.status === 'planned' ?
                    t`View Event` : t`View Event`}
                  onPrimaryAction={() => {
                    browserHistory.push(`/events/${event._id}`);
                  }}
                  onPrevSelected={() => {
                    browserHistory.replace(`/organizations/${organization._id}/event/${prevEvent._id}`);
                  }}
                  onNextSelected={() => {
                    browserHistory.replace(`/organizations/${organization._id}/event/${nextEvent._id}`);
                  }}
                  hasMore={events.length > 1} />);
              }
              else {
                return (
                  <EventMiniMarker
                    event={event}
                    key={String(event._id)}
                    onClick={() => {
                      this.setState({ selectedPlace: null });
                      browserHistory.replace(`/organizations/${organization._id}/event/${event._id}`);
                    }}
                  />);
              }
            })}

            <PlaceDetailsContainer
              className="place-details-container"
              feature={this.state.selectedPlace}
              onClose={this.dismissPlaceDetails}
            />
          </Map>
        </div>
      </MapLayout>
    );
  }

  private onMarkerClick = (featureId) => {
    const organization = this.props.model.organization;
    browserHistory.replace(`/organizations/${organization._id}/place/${featureId}`);
  }

  private dismissPlaceDetails = () => {
    this.setState({ selectedPlace: null });

    const organization = this.props.model.organization;
    browserHistory.replace(`/organizations/${organization._id}/browse`);
  }

  private determineMapPosition(selectedEvent: IEvent | null, selectedPlace: IPlaceInfo | null) {
    if (this.state.mapWasMovedManually) {
      return {};
    }

    if (selectedPlace) {
      const coordinates = selectedPlace.geometry.coordinates;
      return { lat: coordinates[1], lon: coordinates[0], zoom: 17 };
    }

    if (selectedEvent) {
      return { bbox: regionToBbox(selectedEvent.region || defaultRegion) };
    }

    return {};
  }

  private onMapMoveEnd = () => {
    if (!this.ignoreMapMovement) {
      this.setState({ mapWasMovedManually: true });
    }
  }

  private onMapBboxApplied = () => {
  }

  private redirectToCorrectRoute(props: PageProps, isInitialMount: boolean) {
    // decide if the url is correct and matches our event
    const organization = props.model.organization;
    const events = props.model.events;

    if (props.params.event_id) {
      const eventIndex = events.findIndex((e) => {
        return e._id === props.params.event_id;
      });

      // current url is pointing to a missing key
      if (eventIndex === -1) {
        if (events.length > 0) {
          // take alternative first event
          browserHistory.replace(`/organizations/${organization._id}/event/${events[0]._id}`);
        } else {
          // take no event organization page
          browserHistory.replace(`/organizations/${organization._id}`);
        }
      }
    } else if (props.params.place_id) {
      accessibilityCloudFeatureCache.getFeature(props.params.place_id).then((feature: IPlaceInfo) => {
        this.setState({ selectedPlace: feature });
      }, (reason) => {
        console.error('Failed loading feature', reason);
      });
    } else if (events.length > 0 && isInitialMount) {
      // select first event url
      browserHistory.replace(`/organizations/${organization._id}/event/${events[0]._id}`);
    }

  }
};

const ReactiveShowOrganizationPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowOrganizationPage),
  (id): IPageModel | null => {
    const organization = Organizations.findOne(id);
    const events = organization ? organization.getEvents() : null;
    // fetch model with organization & events in one go
    return organization && events ? { organization, events: events || [] } : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.public', 'users.my.private');


export default styled(ReactiveShowOrganizationPage) `
`;
