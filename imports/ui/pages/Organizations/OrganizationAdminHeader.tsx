import styled from 'styled-components';
import * as React from 'react';
import {t} from 'c-3po';

import {IStyledComponent} from '../../components/IStyledComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';
import AdminHeader from '../../components/AdminHeader';
import AdminTab from '../../components/AdminTab';
import Button from '../../components/Button';

interface ITabProps {
  id: Mongo.ObjectID | undefined;
};

const OrganizationTabs = (props: IStyledComponent & ITabProps) => {
  return (
    <section className={props.className}>
      <AdminTab to={`/organizations/${props.id}/organize`} title={t`Dashboard`}/>
      <AdminTab to={`/organizations/${props.id}/members`} title={t`Members`}/>
      {/* <AdminTab to={`/organizations/${props.id}/statistics`} title={t`Statistics`}/> */}
      <AdminTab to={`/organizations/${props.id}/edit`} title={t`Edit`}/>
    </section>
  );
};

interface IHeaderModel {
  organization: IOrganization;
};

const OrganizationAdminHeader = (props: IStyledComponent & IHeaderModel) => (
  <AdminHeader
    titleComponent={(
      <OrganizationsDropdown current={props.organization}>
        <Button to="/organizations/create">{t`Create Organization`}</Button>
      </OrganizationsDropdown>
    )}
    tabs={<OrganizationTabs id={props.organization._id}/>}
    publicLink={`/organizations/${props.organization._id}`}
  />);

export default styled(OrganizationAdminHeader) `
`;
