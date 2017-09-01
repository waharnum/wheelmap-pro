import {Link} from 'react-router';
import styled from 'styled-components';
import * as React from 'react';
import { wrapDataComponent } from './AsyncDataComponent';

import { IStyledComponent } from './IStyledComponent';
import { IOrganization, Organizations } from '../../both/api/organizations/organizations';
import { IAsyncDataProps, reactiveModelSubscription } from './reactiveModelSubscription';

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
  children: JSX.Element | JSX.Element[];
  current: IOrganization;
}

type OrganizationDropdownInternalType =
    IOrganizationDropdownProps & IStyledComponent & IAsyncDataProps<IOrganization[]>;

// An organization chooser
const OrganizationDropdown = (props: OrganizationDropdownInternalType) => {
  return (
    <div className={props.className + ' dropdown'}>
      <h1 className="dropdown-toggle" id="OrganizationDropdown" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="true">
        {props.current.name}
      </h1>
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) =>
          <OrganizationEntry key={m._id as React.Key} model={m} active={props.current === m._id}/> )}
        {props.children}
      </ul>
    </div>
  );
};

const ReactiveOrganizationDropdown = reactiveModelSubscription(
    wrapDataComponent<IOrganization[], IAsyncDataProps<IOrganization[] | null>,
                                       IAsyncDataProps<IOrganization[]>>(OrganizationDropdown),
    Organizations, 'organizations.my.private');

const StyledReactiveOrganizationDropdown = styled(ReactiveOrganizationDropdown) `
  .dropdown-toggle {
    cursor: pointer;
  }
`;

export default StyledReactiveOrganizationDropdown;
