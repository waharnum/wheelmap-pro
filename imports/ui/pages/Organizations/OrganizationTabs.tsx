import styled from 'styled-components';
import * as React from 'react';
import {LocationDescriptor} from 'history';

import AdminTab from '../../components/AdminTab';
import { IStyledComponent } from '../../components/IStyledComponent';

interface ITabProps {
  id: Mongo.ObjectID;
};

const OrganizationTabs = (props: IStyledComponent & ITabProps) => {
  return (
    <section className={props.className}>
      <AdminTab to={`/organizations/${props.id}/organize`} title="Dashboard" />
      <AdminTab to={`/organizations/${props.id}/members`} title="Members" />
      <AdminTab to={`/organizations/${props.id}/statistics`} title="Statistics" />
      <AdminTab to={`/organizations/${props.id}/edit`} title="Customize" />
    </section>
  );
};

export default styled(OrganizationTabs) `
`;
