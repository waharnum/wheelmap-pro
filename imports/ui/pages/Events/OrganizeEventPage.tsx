import * as React from 'react';
import styled from 'styled-components';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import AdminTab from '../../components/AdminTab';
import { default as AdminHeader, HeaderTitle } from '../../components/AdminHeader';

import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';
import EventTabs from './EventTabs';

const OrganizeEventPage = (props: IModelProps<IEvent> & IStyledComponent) => {
  const model = props.model || {
    _id: "123",
    name: "Some mapathon",
    description: 'asj dflkjsdf ;lajksdf;l akjdfadf',
    regionName: 'Montreal',
    startTime: new Date("2017-10-10 12:10:12"),
    endTime: new Date("2017-10-10 15:10:12"),
    webSiteUrl: 'https://eventbrite.com',
    photoUrl: 'http://payload487.cargocollective.com/1/14/476606/12056934/prt_400x400_1483600669.jpg',
    invitationToken: '2a2fa3sdf4d34',
    verifyGpsPositionsOfEdits: true,
    targets: {
      mappedPlacesCount: 100,
    },
    status: 'planned',
    visibility: 'public',
  };

  console.log(props);
  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader
        titleComponent={
          <HeaderTitle
            title={model.name}
            logo={<div className="organisation-logo" />}
          />
        }
        tabs={(<EventTabs />)}
      />
      <div className="content-area scrollable">
        <div className={props.className || ''}>
          <div>{model.description}</div>
          <div>{model.webSiteUrl}</div>
          <div>{model.photoUrl}</div>
          <Button to={`/events/edit/${model._id}`}>Edit</Button>
        </div>
      </div>
    </ScrollableLayout>
  );
};

export default styled(OrganizeEventPage) `
  .organisation-logo::after {
    display: none;
  }
`;
;;