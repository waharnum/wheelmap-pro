import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import {Meteor} from 'meteor/meteor';

import MapLayout from '../../layouts/MapLayout';
import {browserHistory} from 'react-router';

import Map from '../../components/Map';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {default as PublicHeader, HeaderTitle} from '../../components/PublicHeader';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {defaultRegion} from '../Events/EventBaseForm';
import EventMiniMarker from '../Events/EventMiniMarker';
import EventMapPopup from '../Events/EventMapPopup';

interface IPageModel {
  organization: IOrganization;
  events: Array<IEvent>;
}

type PageParams = {
  params: {
    _id: string,
    event_id: string | undefined
  }
}
type PageProps = PageParams & IAsyncDataByIdProps<IPageModel> & IStyledComponent;

class ShowOrganizationPage extends React.Component<PageProps> {
  ignoreMapMovement: boolean;
  state: {
    placeDetailsShown: boolean,
    mapWasMovedManually: false,
  } = {
    placeDetailsShown: false,
    mapWasMovedManually: false,
  }

  public componentWillMount() {
    this.redirectToCorrectRoute(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    if (this.props.params.event_id != nextProps.params.event_id) {
      this.ignoreMapMovement = true;
      this.redirectToCorrectRoute(nextProps);
      this.setState({mapWasMovedManually: false}, () => {
        this.ignoreMapMovement = false;
      });
    }
  }

  public render() {
    const organization = this.props.model.organization;
    const events = this.props.model.events;

    let eventIndex = 0;
    if (this.props.params.event_id) {
      eventIndex = events.findIndex((e) => {
        return e._id == this.props.params.event_id;
      });
    }

    const selectedEvent = events[eventIndex];
    const nextEvent = events[(eventIndex + 1) % events.length];
    const prevEvent = events[(eventIndex + events.length - 1) % events.length];

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
            {...this.determineMapPosition(selectedEvent)}
            onBboxApplied={this.onMapBboxApplied}
            onMoveEnd={this.onMapMoveEnd}
            onPlaceDetailsChanged={(options) => {
              this.setState({placeDetailsShown: options.visible})
            }}>
            {events.map((event) => {
              if (event._id == selectedEvent._id) {
                return (<EventMapPopup event={event}
                                       key={String(event._id)}
                                       primaryAction={t`Join Us!`}
                                       onPrimaryAction={() => {
                                         browserHistory.push(`/events/${event._id}`)
                                       }}
                                       onPrevSelected={() => {
                                         browserHistory.replace(`/organizations/${organization._id}/event/${prevEvent._id}`)
                                       }}
                                       onNextSelected={() => {
                                         browserHistory.replace(`/organizations/${organization._id}/event/${nextEvent._id}`)
                                       }}
                                       hasMore={events.length > 1}/>);
              }
              else {
                return (
                  <EventMiniMarker
                    event={event}
                    key={String(event._id)}
                    onClick={() => {
                      browserHistory.replace(`/organizations/${organization._id}/event/${event._id}`);
                    }}
                  />);
              }
            })}
          </Map>
        </div>
      </MapLayout>
    );
  }

  private determineMapPosition(selectedEvent: IEvent) {
    if (!selectedEvent || this.state.mapWasMovedManually) {
      return {};
    }

    return {bbox: regionToBbox(selectedEvent.region || defaultRegion)};
  }

  private onMapMoveEnd = () => {
    if (!this.ignoreMapMovement) {
      this.setState({mapWasMovedManually: true});
    }
  }

  private onMapBboxApplied = () => {
  }

  private redirectToCorrectRoute(props: PageProps) {
    // decide if the url is correct and matches our event
    const organization = props.model.organization;
    const events = props.model.events;

    if (props.params.event_id) {
      const eventIndex = events.findIndex((e) => {
        return e._id == props.params.event_id;
      });

      // current url is pointing to a missing key
      if (eventIndex == -1) {
        if (events.length > 0) {
          // take alternative first event
          browserHistory.replace(`/organizations/${organization._id}/event/${events[0]._id}`);
        } else {
          // take no event organization page
          browserHistory.replace(`/organizations/${organization._id}`);
        }
      }
    } else if (events.length > 0) {
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
    return organization && events ? {organization, events: events || []} : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.public', 'users.my.private');


export default styled(ReactiveShowOrganizationPage) `
`;
