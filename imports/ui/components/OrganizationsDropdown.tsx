import {Link} from 'react-router';
import styled from 'styled-components';
import {colors} from '../stylesheets/colors';
import * as React from 'react';
import {t} from 'c-3po';
import {wrapDataComponent} from './AsyncDataComponent';

import {IStyledComponent} from './IStyledComponent';
import {IOrganization, Organizations} from '../../both/api/organizations/organizations';
import {IAsyncDataProps, reactiveSubscription} from './reactiveModelSubscription';

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
  children: React.ReactNode;
  current?: IOrganization;
}

type OrganizationDropdownInternalType = IStyledComponent & IAsyncDataProps<IOrganization[]>;

// An organization chooser
const OrganizationDropdown = (props: OrganizationDropdownInternalType & IOrganizationDropdownProps) => {
  return (
    <div className={props.className + ' dropdown'}>
      {props.current ?
        (<div className="dropdown-toggle title-bar" id="OrganizationDropdown" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="true">
          {props.current.logo ?
            <div className="organization-logo" style={{backgroundImage: `url(${props.current.logo})`}}/> : null}
          <h1>{props.current.name}</h1>
        </div>)
        :
        (<div className="dropdown-toggle title-bar" id="OrganizationDropdown" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="true">
          <a className="logo">
            <h1>{t`wheelmap.pro`}</h1>
          </a>
        </div>)
      }
      <ul className="dropdown-menu" aria-labelledby="OrganizationDropdown">
        {props.model.map((m) =>
          <OrganizationEntry key={String(m._id)} model={m}
                             active={props.current ? props.current._id === m._id : false}/>)}
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

export default styled(StyledReactiveOrganizationDropdown) `

position: relative;

/* chevron indicating organization dropdown */
&.dropdown::after {
  position: absolute;
  right: -4px;
  top: calc(50% - 7px);
  content: 'Í';
  color: rgba(255, 255, 255, 0.3);
  font-family: 'iconfield-v03';
  font-size: 14px;
  transform: rotate(-90deg);
  transition: transform 200ms ease;
}

&.dropdown.open::after {
  transform: rotate(0deg);
}

ul {
  min-width: 20em;
  padding: 8px;
  background-color: ${colors.bgAnthracite};

  li a {
    margin: 4px 0;
    padding: 8px 32px 8px 16px;
    font-size: 21px;
    line-height: 34px;
    font-weight: 300;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: transparent !important;
  }
  
  a.btn {
    color: ${colors.linkBlue} !important;
  }

  li:hover,
  li.active:hover {

    a {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    &:after {
      opacity: 1;
    }
  }
  
  li.active,
  li:hover {
    position: relative;
    background: transparent;
    
    a {
      color: white;
      font-weight: 800;
      background: transparent;
    }

    &:after { /* checkmark icon */
      content: "";
      position: absolute;
      top: 10px;
      right: 6px;
      width: 20px;
      height: 20px;
      color: white;
      opacity: 0.5;
      font-family: "iconfield-v03";
      font-size: 21px;
      text-align: center;
    }
  } 
}

`;
