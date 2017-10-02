import styled from 'styled-components';
import * as React from 'react';

import {IStyledComponent} from '../../components/IStyledComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';
import AdminHeader from '../../components/AdminHeader';
import AdminTab from '../../components/AdminTab';
import Button from '../../components/Button';

interface ITabProps {
  id: Mongo.ObjectID;
};

const OrganizationTabs = (props: IStyledComponent & ITabProps) => {
  return (
    <section className={props.className}>
      <AdminTab to={`/organizations/${props.id}/organize`} title="Dashboard"/>
      <AdminTab to={`/organizations/${props.id}/members`} title="Members"/>
      <AdminTab to={`/organizations/${props.id}/statistics`} title="Statistics"/>
      <AdminTab to={`/organizations/${props.id}/edit`} title="Customize"/>
    </section>
  );
};

interface IHeaderModel {
  organization: IOrganization;
};

const OrganizationAdminHeader = (props: IStyledComponent & { model: IHeaderModel }) => (
  <AdminHeader
    titleComponent={(
      <OrganizationsDropdown current={props.model.organization}>
        <Button to="/organizations/create" className="btn-primary">Create Organization</Button>
      </OrganizationsDropdown>
    )}
    tabs={<OrganizationTabs id={props.model.organization._id || ''}/>}
    publicLink={`/organizations/${props.model.organization._id}`}
  />);

export default styled(OrganizationAdminHeader) `
`;
