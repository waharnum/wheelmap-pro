import { Link } from 'react-router';
import styled from 'styled-components';
import * as React from 'react';
import {LocationDescriptor} from 'history';

import AdminTab from './AdminTab';
import UserMenu from './UserMenu';
import PreviewToggle from './PreviewToggle';
import { IStyledComponent } from '../components/IStyledComponent';

interface IAdminHeaderProps {
  titleComponent: JSX.Element | string;
  children?: JSX.Element | JSX.Element[];
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
          <div className="organisation-logo" style={{backgroundImage: `url(${props.logo})`}} />
        </Link>)
        : null}
      {props.prefixTitle && !props.logo ?
        <h1 className="organisation-logo"><Link to={props.prefixLink || ''}>{props.prefixTitle}</Link></h1> : null}
      <h1><Link to={props.titleLink || ''}>{props.title}</Link></h1>
    </div>
  );
};

const AdminHeader = (props: IAdminHeaderProps & IStyledComponent) => {
  return (
    <div className={props.className} >
      <header className="main-header on-dark">
        <div className="left-side">
          {props.titleComponent || <HeaderTitle title="Please specificy title component" />}
          <ol className="tabs-header">
            {props.tabs}
          </ol>
        </div>
        <div className="right-side">
          <ol className="secondary-tools">
            <PreviewToggle to={props.publicLink} />
            <UserMenu />
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
  justify-content: space-between;

  .title-bar {
    display: flex;
    
    .organisation-logo {
      flex-shrink: 0;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;

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
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    ol.secondary-tools {
      margin: 0;
      text-transform: uppercase;
      
      li {
        padding: 8px 10px;
        text-decoration: none;
        display: inline-block;

        a {
          font-size: 14px;
        }
        
        &.user-menu {
          position: relative;
          padding-right: 16px;

          &::after {
            position: absolute;
            right: 0px;
            top: 10px;
            content: "Í";
            font-family: "iconfield-v03";
            font-size: 14px;
          }
        }

        &.public-view {
          position: relative;
          padding-left: 28px;
          
          &::before {
            position: absolute;
            content: " ";
            width: 24px;
            height: 24px;
            top: 8px;
            left: 0;
            background-image: url(/images/icon-public-view@2x.png); 
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}

/* ----------------------------- dark admin version -----------------------*/

.main-header.on-dark {
  min-height: 128px;
  padding-bottom: 0;
  color: #DEE1E7;
  background-color: #37404D;
  display: flex;

  a {
    color: #DEE1E7;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title-bar {
      flex-grow: 2;
      padding-top: 20px;

      .organisation-logo {
        position: relative;
        width: 95px; /* FIXME: width should be dynamic */
        height: 52px;
        margin-right: 30px;
        
        &::after {
          position: absolute;
          content: " ";
          right: -19px;
          top: 8px;
          width: 8px;
          height: 32px;
          background-image: url(/images/chevron-big-right-bright@2x.png); 
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
      
      h1 {
        margin: 0;
        padding-top: 11px;
        font-size: 30px;
        line-height: 30px;
        font-weight: 800;
      }
    }

    ol.tabs-header {
      margin: 0;

      li {
        display: inline-block;
        margin: 0 24px 0 0 ; 
        border-bottom: 2px solid transparent;   

        a {
          font-size: 14px;
          line-height: 36px;
          text-transform: uppercase;
          letter-spacing: 0.285px;
        }

        &.active,
        &:hover {
          border-bottom: 2px solid #1FABD9;           

          a {
            font-weight: 600;
            letter-spacing: 0;
          }
        }
      }
    }
  }
 
  .right-side ol.secondary-tools li.public-view::before {
    background-image: url(/images/icon-public-view@2x.png); 
  }
}

`;
;