import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';
import {Meteor} from 'meteor/meteor';

import MapLayout from '../../layouts/MapLayout';
import {browserHistory} from 'react-router';

import Button from '../../components/Button';
import Map from '../../components/Map';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {colors} from '../../stylesheets/colors';
import {default as PublicHeader, HeaderTitle} from '../../components/PublicHeader';
import EventStatistics from '../Events/EventStatistics';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';

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

  public componentWillMount() {
    this.redirectToCorrectRoute(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    this.redirectToCorrectRoute(nextProps);
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
    const event = events[eventIndex];
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
            bbox={event && event.region ? regionToBbox(event.region) : undefined}
          />
          {event ? (
            <div className="map-overlay">
              <div className="box-area">
                <div className="event-box">
                  <div className="event-information">
                    <div className="event-description">
                      <h3>{event.name} ({event.status})</h3>
                      <h4>{moment(event.startTime).format('LL')}</h4>
                      <p className="event-region">{event.regionName}</p>
                    </div>
                    <Button to={`/organizations/${organization._id}/event/${prevEvent._id}`}
                            className='btn-primary'>{'<'}</Button>
                    <Button to={`/events/${event._id}`} className='btn-primary'>{t`Join Us`}</Button>
                    <Button to={`/organizations/${organization._id}/event/${nextEvent._id}`}
                            className='btn-primary'>{'>'}</Button>
                  </div>
                  <EventStatistics
                    event={event}
                    achieved={true}
                    countdown={'short'}/>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </MapLayout>
    );
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
  .map {
    justify-content: center;
    align-content: center;
    display: flex;
  }
  
  .map-overlay {
    display: flex;
    justify-content: center;
    align-content: center;
  
    .box-area {
      margin: auto;

      .event-box {
        margin: 10px;
        padding: 16px 16px 0 16px;
        background: white;
        box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);

        .event-information {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          
          .event-description {         
            
            h3,
            h4 {
              margin-top: 0px;
              margin-bottom: 4px;
              font-size: 21px;
              font-weight: 300 !important;
            }
            h4 {
              opacity: 0.6;
            }
          }
          
          .time-until-event {
            text-align: center;

            p {
              margin: 0;
              font-size: 32px;
              line-height: 32px;
              font-weight: 200 !important;
            }

            small {
              font-size: 11px;
              line-height: 11px;
              font-weight: 300;
              text-transform: uppercase;
            }
          } 
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
    
          a.btn {
            margin-bottom: 10px;
            padding-right: 0;
          }
        }

        .stats {
          padding-top: 20px;
          background-color: white;
          display: flex;
          justify-content: flex-start;
          
          &.organization-stats {
            border-bottom: 1px solid ${colors.shadowGrey};
          }
      
          section {
            padding: 0px 10px 0 10px;
            text-align: center;
            border-right: 1px solid ${colors.shadowGrey};
            display: flex;
      
            &:last-child {
              border-right: 0;
            }
      
            span {
              position: relative;
              padding: 0 10px 16px 10px;
              font-size: 30px;
              line-height: 30px;
              font-weight: 200;
              display: flex;
              flex-direction: column;
              align-items: center;
      
              &.key-figure {
                font-size: 32px;
                // font-weight: 800;
              }
      
              small {
                font-size: 11px;
                line-height: 11px;
                font-weight: 300;
                text-transform: uppercase;
              }
            }
      
            &:before {
              position: relative;
              top: 2px;
              left: 0;
              width: 27px;
              height: 27px;
              content: " ";
              background-image: url(/images/icon-person@2x.png); 
              background-position: center center;
              background-repeat: no-repeat;
              background-size: 100% 100%;
            }
          }
      
          /* prefix icons*/
          section.participant-stats:before { background-image: url(/images/icon-person@2x.png); }
          section.location-stats:before { background-image: url(/images/icon-location@2x.png); }
          section.event-stats:before { background-image: url(/images/icon-date@2x.png); }
          section.new-event:before { 
            width: 0;
            height: 0;
            background-image: none; 
          }
        }
      }
    }
  }`;
