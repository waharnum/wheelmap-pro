import {Link} from 'react-router';
import styled from 'styled-components';
import * as React from 'react';
import { wrapDataComponent } from './AsyncDataComponent';

import { IStyledComponent } from './IStyledComponent';
import { IOrganization, Organizations } from '../../both/api/organizations/organizations';
import { IAsyncDataProps, reactiveSubscription } from './reactiveModelSubscription';

interface IListEntryModelProps {
  model: IOrganization;
  active: boolean;
}

const OrganizationEntry = (props: IListEntryModelProps) => {
  return (
    <li className={props.active ? 'active' : ''}>
      <Link to={`/organizations/${props.model._id}/organize`}>{props.model.name}</Link>
    </li>
  );
};

interface IOrganizationDropdownProps {
  children: JSX.Element | JSX.Element[] | null;
  current: IOrganization;
}

type OrganizationDropdownInternalType = IStyledComponent & IAsyncDataProps<IOrganization[]>;

// An organization chooser
const OrganizationDropdown = (props: OrganizationDropdownInternalType & IOrganizationDropdownProps) => {
  return (
    <div className={props.className + ' dropdown'}>
      <div className="dropdown-toggle title-bar" id="OrganizationDropdown" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="true">
        {props.current.logo ?
          <div className="organisation-logo" style={{backgroundImage: `url(${props.current.logo})`}} /> : null}
        <h1>{props.current.name}</h1>
      </div>
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) =>
          <OrganizationEntry key={m._id as React.Key} model={m} active={props.current === m._id}/> )}
        {props.children}
      </ul>
    </div>
  );
};

const ReactiveOrganizationDropdown = reactiveSubscription(
    wrapDataComponent<IOrganization[], IOrganizationDropdownProps & IAsyncDataProps<IOrganization[] | null>,
                      IOrganizationDropdownProps & IAsyncDataProps<IOrganization[]>>(OrganizationDropdown),
                      // TODO: align this filter to only display my organizations
                      () => Organizations.find({}, {sort: {name: 1}}).fetch(),
                      'organizations.my.private');

// hide all unneeded internal props
type OrganizationDropdownExternalType = IStyledComponent & IOrganizationDropdownProps;

const StyledReactiveOrganizationDropdown = styled<OrganizationDropdownExternalType>(ReactiveOrganizationDropdown) `
  .dropdown-toggle {
    cursor: pointer;
  }
`;

export default StyledReactiveOrganizationDropdown;
