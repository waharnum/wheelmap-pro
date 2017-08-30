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

const OrganizationDropdown = (props: IStyledComponent & IListModelProps<IOrganization>) => {
  if (!props.ready) {
    return (
      <div className={props.className || ''}>Loading…</div>
    );
  }

  return (
    <div className={props.className + ' dropdown'}>
      <button className="btn btn-default dropdown-toggle" type="button"
          id="OrganizationDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">      
        <span className="caret"></span>
        &lt; current active &gt;
      </button>
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) => <OrganizationEntry key={m._id as React.Key} model={m} /> )}
      </ul>
    </div>
  );
};

const ReactiveOrganizationDropdown = reactiveModelSubscription(OrganizationDropdown, Organizations, 'organizations.my.private');
const StyledReactiveOrganizationDropdown = styled(ReactiveOrganizationDropdown) `
`;

export default StyledReactiveOrganizationDropdown;
