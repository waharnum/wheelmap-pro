import * as React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router';
import {t} from 'c-3po';

import {IStyledComponent} from '../../../components/IStyledComponent';
import {IOrganization} from '../../../../both/api/organizations/organizations';
import UserFooter from './UserFooter';


type Props = {
  organization: IOrganization;
  onGotoUserPanel: () => void;
};

class OrganizationAboutPanel extends React.Component<IStyledComponent & Props> {

  public render() {
    const {className, organization, onGotoUserPanel} = this.props;

    const adminLink = organization.editableBy(Meteor.userId()) ? `/organizations/${organization._id}/organize` : undefined;

    return (
      <div className={className}>
        {organization.logo &&
        <div className="organization-logo" style={{backgroundImage: `url(${organization.logo})`}}/>}
        <h1>{organization.name}</h1>
        <section className="organization-description">
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
            {adminLink && <li><Link to={adminLink}>{t`Administrate`}</Link></li>}
          </ul>
        </section>
        <UserFooter onClick={onGotoUserPanel}/>
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
  
  h1 {
    font-size: 32px;
  }
  
  .organization-description {
    font-size: 16px;
    line-height: 21px;
  }
  
  .organization-links {
    flex: 1;
    margin-top: 32px;
    
    li {
      font-size: 24px;
      margin-bottom: 19px;
    }
  }
 

  .organization-logo {
    background-position: left center;
    background-repeat: no-repeat;
    background-size: contain;
    min-height: 50px;
    
    a {
      text-overflow: ellipsis;
      display: block;
      overflow: hidden;
      white-space: nowrap;
    }      
  }
`;
