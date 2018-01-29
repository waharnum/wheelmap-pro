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
    const {organization, event} = this.props.model;

    let content: React.ReactNode = null;
    let header: React.ReactNode = null;
    let additionalMapPanel: React.ReactNode = null;
    let forceContentToSidePanel: boolean = false;
    let canDismissSidePanel: boolean = true;

    content = <EventPanel event={event}/>;
    header = <LogoHeader link={`/new/organizations/${organization._id}`}
                         prefixTitle={organization.name}
                         logo={organization.logo}
                         title={t`Event`}/>;
    canDismissSidePanel = false;

    return {
      content,
      header,
      additionalMapPanel,
      forceContentToSidePanel,
      canDismissSidePanel,
    };
  }

  public render() {
    const {organization, event} = this.props.model;
    const {content, header, additionalMapPanel, forceContentToSidePanel, canDismissSidePanel} = this.getPanelContent();

    const bbox = regionToBbox(event.region || defaultRegion);

    return (
      <NewMapLayout
        className={this.props.className}
        header={header}
        contentPanel={content}
        additionalMapPanel={additionalMapPanel}
        forceContentToSidePanel={forceContentToSidePanel}
        canDismissSidePanel={canDismissSidePanel}
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
