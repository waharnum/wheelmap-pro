import styled from 'styled-components';
import * as React from 'react';
import {LocationDescriptor} from 'history';

import AdminTab from '../../components/AdminTab';
import { IStyledComponent } from '../../components/IStyledComponent';

interface ITabProps {
  id: Mongo.ObjectID;
};

const EventTabs = (props: IStyledComponent & ITabProps) => {
  return (
    <section className={props.className}>
      <AdminTab to={`/events/${props.id}/organize`} title="Event Overview" />
      <AdminTab to={`/events/${props.id}/participants`} title="Participants" />
      <AdminTab to={`/events/${props.id}/edit`} title="Customize"  />
      <AdminTab to={`/events/${props.id}/statistics`} title="Statistics" />
    </section>
  );
};

export default styled(EventTabs) `
`;
