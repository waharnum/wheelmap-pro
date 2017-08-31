import * as React from 'react';
import styled from 'styled-components';

import { reactiveModelSubscription, IListModelProps } from './reactiveModelSubscription';
import { IOrganization, Organizations } from '../../both/api/organizations/organizations';
import { IStyledComponent } from './IStyledComponent';

interface IListEntryModelProps {
  model: IOrganization;
}

const OrganizationEntry = (props: IListEntryModelProps) => {
  return (
    <li>{props.model.name}</li>
  );
};

interface IOrganizationDropdownProps {
  children: JSX.Element | JSX.Element[];
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
        &lt; current active &gt;
      </h1>
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) => <OrganizationEntry key={m._id as React.Key} model={m} /> )}
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
