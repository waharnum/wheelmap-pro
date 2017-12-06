import styled from 'styled-components';
import * as React from 'react';
import {Link} from 'react-router';

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

const ShowEventPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
    const event = props.model.event;
    const organization = props.model.organization;
    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <MapLayout className={props.className}>
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
            bbox={bbox}
            locateOnStart={true}>
            <Link to={`/events/${event._id}/create-place`} className="add-place">+</Link>
          </Map>
        </div>
      </MapLayout>
    );
  }
;

const ReactiveShowEventPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowEventPage),
  (id): IPageModel | null => {
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
