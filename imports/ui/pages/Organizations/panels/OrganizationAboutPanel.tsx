import * as React from 'react';
import styled from 'styled-components';

import {IStyledComponent} from '../../../components/IStyledComponent';
import {IOrganization} from '../../../../both/api/organizations/organizations';
import UserMenu from '../../../components/UserMenu';


type Props = {
  organization: IOrganization;
};

class OrganizationAboutPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, organization} = this.props;

    return (
      <div className={className}>
        {organization.logo &&
        <div className="organization-logo" style={{backgroundImage: `url(${organization.logo})`}}/>}
        <h1>{organization.name}</h1>
        <section>
          {organization.description}
        </section>
        <section className="organization-links">
          <ul>
            <li><a>News</a></li>
            <li><a>Get involved</a></li>
            <li><a>Press</a></li>
            <li><a>Contact</a></li>
            <li><a>Imprint</a></li>
            <li><a>FAQ</a></li>
          </ul>
        </section>
        <footer>
          <UserMenu/>
        </footer>
      </div>
    );
  }
};

export default styled(OrganizationAboutPanel) `
  // shared between all panels
  padding: 10px;
  flex: 1;
  // custom styling
  display: flex;
  flex-direction: column;
  
  .organization-links {
    flex: 1;
  }

  .organization-logo {
    background-position: left center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 50px;
    
    a {
      text-overflow: ellipsis;
      display: block;
      overflow: hidden;
      white-space: nowrap;
    }      
  }
`;
