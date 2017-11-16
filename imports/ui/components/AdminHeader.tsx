import {Link} from 'react-router';
import styled from 'styled-components';
import * as React from 'react';
import {LocationDescriptor} from 'history';

import UserMenu from './UserMenu';
import PreviewToggle from './PreviewToggle';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';

interface IAdminHeaderProps {
  titleComponent: JSX.Element | string;
  children?: React.ReactNode;
  tabs?: JSX.Element;
  publicLink?: LocationDescriptor;
}

interface IHeaderTitleProps {
  title: string;
  prefixTitle?: string;
  logo?: string;
  prefixLink?: LocationDescriptor;
  titleLink?: LocationDescriptor;
}

export const HeaderTitle = (props: IHeaderTitleProps) => {
  return (
    <div className="title-bar">
      {props.logo ? (
          <Link to={props.prefixLink || ''}>
            <div className="organization-logo" style={{backgroundImage: `url(${props.logo})`}}/>
          </Link>)
        : null}
      {props.prefixTitle ?
        <h1><Link to={props.prefixLink || ''}>{props.prefixTitle}</Link></h1> : null}
      <h1 className="with-chevron-before"><Link to={props.titleLink || ''}>{props.title}</Link></h1>
    </div>
  );
};

const AdminHeader = (props: IAdminHeaderProps & IStyledComponent) => {
  return (
    <div className={props.className}>
      <header className="main-header on-dark">
        <div className="wrapper on-dark">
          <ol className="secondary-tools">
            <PreviewToggle to={props.publicLink}/>
            <UserMenu/>
          </ol>
          <div className="main-area">
            {props.titleComponent || <HeaderTitle title="Please specificy title component"/>}
            <div className="right-side"/>
          </div>
          <ol className="tabs-header">
            {props.tabs}
          </ol>
        </div>
      </header>
    </div>
  );
};

export default styled(AdminHeader) `

/* ----------------------------- base header styles -----------------------------*/

header.main-header {
  padding: 0 24px 8px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ol.secondary-tools {
    margin: 0;
    text-transform: uppercase;
    text-align: right;
    min-height: 39px;
    
    li {
      padding: 8px 10px;
      text-decoration: none;
      display: inline-block;

      a {
        font-size: 14px;
      }
    }
  }

  .main-area {
    display: flex;
    justify-content: space-between;
    
    .title-bar {
      height: 52px;
      display: flex;
      
      .organization-logo {
        flex-shrink: 0;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        background-color:  white;


        a {
          text-overflow: ellipsis;
          display: block;
          overflow: hidden;
          white-space: nowrap;
        }      
      }
    }

    .right-side {
      display: flex;
    }
  }
}

/* ----------------------------- dark admin version -----------------------*/

.on-dark {
  // color: ${colors.bgAnthracite};
  background-color: #37404D;
}

header.main-header {
  min-height: 128px;
  padding-bottom: 0;
  display: flex;

  a,
  h1 {
    color: ${colors.shadowGrey};
  }

  ol.secondary-tools {

    li::after {
      color: ${colors.shadowGrey};
    }
   
    li.public-view::before {
      background-image: url(/images/icon-public-view@2x.png); 
    }

    section.user-menu,
    .dropdown-toggle:after {
      color: ${colors.shadowGrey};
    }
  }

  .main-area {

    .title-bar {
      flex-grow: 2;

      h1.with-chevron-before {
        padding-left: 30px;

        &::after {
          position: absolute;
          content: " ";
          left: 10px;
          top: 8px;
          width: 8px;
          height: 32px;
          background-image: url(/images/chevron-big-right-bright@2x.png); 
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .organization-logo {
        position: relative;
        width: 42px;
        height: 42px;
        margin-top: 5px;
        margin-right: 10px;
        border-radius: 26px;
      }
      
      h1 {
        position: relative;
        margin: 0;
        padding-top: 9px;
        padding-right: 8px;
        font-size: 30px;
        font-weight: 800;
      }
    }
  }

  ol.tabs-header {
    margin: 0;
    list-style: none;
  }
}
`;
