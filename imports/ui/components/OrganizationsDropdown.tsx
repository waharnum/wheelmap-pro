import * as React from 'react';
import styled from 'styled-components';

import { reactiveModelSubscription, IListModelProps } from './reactiveModelSubscription';
import { IOrganization, Organizations } from '../../both/api/organizations/organizations';
import { IStyledComponent } from './IStyledComponent';

interface IListEntryModelProps {
  model: IOrganization;
  active: boolean;
}

const OrganizationEntry = (props: IListEntryModelProps) => {
  return (
    <li className={props.active ? 'active' : ''}>{props.model.name}</li>
  );
};

interface IOrganizationDropdownProps {
  children: JSX.Element | JSX.Element[];
  current: IOrganization;
}

type OrganizationDropdownInternalType = IOrganizationDropdownProps & IStyledComponent & IListModelProps<IOrganization>;

// An organization chooser
const OrganizationDropdown = (props: OrganizationDropdownInternalType) => {
  if (!props.ready) {
    return (
      <div className={props.className}>Loading…</div>
    );
  }

  return (
    <div className={props.className + ' dropdown'}>
      <h1 className="dropdown-toggle" id="OrganizationDropdown" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="true">
        {props.current.name}
      </h1>
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) => <OrganizationEntry key={m._id as React.Key} model={m} active={props.current === m._id}/> )}
        {props.children}
      </ul>
    </div>
  );
};

const ReactiveOrganizationDropdown = reactiveModelSubscription(
    OrganizationDropdown, Organizations, 'organizations.my.private');

const StyledReactiveOrganizationDropdown = styled(ReactiveOrganizationDropdown) `
`;

export default StyledReactiveOrganizationDropdown;
