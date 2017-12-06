import styled from 'styled-components';
import * as L from 'leaflet';
import {browserHistory, Link, WithRouterProps} from 'react-router';
import * as React from 'react';

import Map from '../../components/Map';
import {colors} from '../../stylesheets/colors';
import MapLayout from '../../layouts/MapLayout';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {IOrganization} from '../../../both/api/organizations/organizations';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import {defaultRegion} from '../../../both/api/events/schema';
import {HeaderTitle, default as PublicHeader} from '../../components/PublicHeader';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

type MapParams = { zoom: number; lat: number; lon: number; bbox: L.LatLngBounds };

type Props = IAsyncDataByIdProps<IPageModel> & IStyledComponent & WithRouterProps;

class MappingPage extends React.Component<Props> {
  public render() {
    const event = this.props.model.event;
    const organization = this.props.model.organization;
    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <MapLayout className={this.props.className}>
        <PublicHeader
          titleComponent={(
            <HeaderTitle
              title={event.name}
              prefixTitle={organization.name}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}`}
            />
          )}
        />
        <div className="content-area">
          <Map
            {...this.props.location.query}
            onMoveEnd={this.onMapMoveEnd}
            locateOnStart={!this.props.location.query}>
            <Link to={{
              pathname: `/events/${event._id}/create-place`,
              state: {mapPosition: this.props.location.query, historyBehavior: 'back'},
            }} className="add-place">+</Link>
          </Map>
        </div>
      </MapLayout>
    );
  }

  private onMapMoveEnd = (params: MapParams) => {
    const {lat, lon, zoom} = params;
    browserHistory.replace({
      pathname: this.props.location.pathname,
      state: this.props.location.state,
      query: {lat, lon, zoom},
    });
  };
};

const ReactiveMappingPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(MappingPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    return event && organization ? {organization, event} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public', 'users.my.private');

export default styled(ReactiveMappingPage) `
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
