import * as React from 'react';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';
import PreviewToggle from './PreviewToggle';
import UserMenu from './UserMenu';
import {LocationDescriptor} from 'history';
import {t} from 'c-3po';
import { colors } from '../stylesheets/colors';
import {Link} from 'react-router';

interface IPublicHeaderProps {
  titleComponent: JSX.Element | string;
  organizeLink?: LocationDescriptor;
}

interface IHeaderTitleProps {
  title: string;
  prefixTitle?: string;
  description?: string;
  logo?: string;
  prefixLink?: LocationDescriptor;
  titleLink?: LocationDescriptor;
}

export const HeaderTitle = (props: IHeaderTitleProps) => {
  return (
    <div className="title-bar">
      {props.logo ? (
        <Link to={props.prefixLink || ''}> 
          <div className="organization-logo" style={{backgroundImage: `url(${props.logo})`}} />
        </Link>)
        : null}
      {props.prefixTitle && !props.logo ?
        <h1 className="organization-logo"><Link to={props.prefixLink || ''}>{props.prefixTitle}</Link></h1> : null}
      <div className="header-information">
        <h1><Link to={props.titleLink || ''}>{props.title}</Link></h1>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

const PublicHeader = (props: IPublicHeaderProps & IStyledComponent) => {
  return (
    <div className={props.className} >
      <header className="main-header on-white">
        <ol className="secondary-tools">
          <PreviewToggle to={props.organizeLink} toOrganize={true} />
          <UserMenu />
        </ol>
        <div className="main-area">
          <div className="left-side">
            {props.titleComponent ||
              <HeaderTitle title="Please specificy title component" description="Pretty please?!" />}
          </div>
        </div>
      </header>
    </div>
  );
};

export default styled(PublicHeader) `

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
        display: flex;
        
        .organization-logo {
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
      }
    }
  }

/* ----------------------------- white public version -----------------------*/

  header.main-header.on-white {
    min-height: 128px;
    color: ${colors.bgAnthracite};
    background-color: white;

    a {
      color: ${colors.bgAnthracite};
    }

    a.btn-primary {
      color: white;
    }

    ol.secondary-tools li::before {
      background-image: url(/images/icon-admin-view@2x.png); 
    }

    .main-area {

      .title-bar {
        display: flex;
        
        .organization-logo {
          flex-shrink: 0;
          position: relative;
          width: 95px;
          height: 52px;
          margin-right: 30px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
          
          &::after {
            position: absolute;
            content: " ";
            right: -19px;
            top: 8px;
            width: 8px;
            height: 32px;
            background-image: url(/images/chevron-big-right-dark@2x.png); 
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }
        
        h1 {
          margin: 0;
          padding-top: 11px;
          line-height: 30px;
          font-size: 30px;
          font-weight: 800;
        }

        p {
          content: " ";
          display: inline-block;
          min-height: 50px;
        }
      }

      .right-side {

      }
    }
  }


`;
