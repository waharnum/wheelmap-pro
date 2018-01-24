import * as React from 'react';
import styled from 'styled-components';

import { IStyledComponent } from './IStyledComponent';
import PreviewToggle from './PreviewToggle';
import UserMenu from './UserMenu';
import { LocationDescriptor } from 'history';
import { t } from 'c-3po';
import { colors } from '../stylesheets/colors';
import { Link } from 'react-router';

interface IPublicHeaderProps {
  titleComponent: JSX.Element | string;
  organizeLink?: LocationDescriptor | null;
  action?: JSX.Element | null;
}

interface IHeaderTitleProps {
  title: string;
  subTitle?: string;
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
          <div className="organization-logo" style={{ backgroundImage: `url(${props.logo})` }} />
        </Link>)
        : null}
      {props.prefixTitle ?
        <h1 className='organization-title'><Link to={props.prefixLink || ''}>{props.prefixTitle}</Link></h1> : null}
      <div className="header-information">
        <div className="headline">
          <h1 className='with-chevron-before'><Link to={props.titleLink || ''}>{props.title}</Link></h1>
          <h2 className='event-date'>{props.subTitle || ''}</h2>
        </div>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

const PublicHeader = (props: IPublicHeaderProps & IStyledComponent) => {
  const allNames = [
    props.className,
    'sidebar-area',
  ].join(' ');
  return (
    <div className={allNames}>
      <header className="main-header on-white">
        <div className="wrapper on-white">
          <ol className="secondary-tools">
            <PreviewToggle to={props.organizeLink} toOrganize={true} />
            <UserMenu />
          </ol>
          <div className="main-area">
            <div className="left-side">
              {props.titleComponent ||
                <HeaderTitle title="Please specificy title component" description="Pretty please?!" />}
            </div>
            <div className="right-side">
              {props.action}
            </div>
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
        
        .header-information {
          p {
            font-size: 16px;
          }
        }
      }
      
      .right-side {
        display: flex;
        align-items: flex-start;

        a.btn-primary {
          margin-top: 6px;
        }
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
          margin-right: 10px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .headline {
          display: flex;
        }
        
        h1,
        h2 {
          margin: 0;
          font-size: 30px;
          padding-top: 11px;
          line-height: 30px;
        }

        h1 {
          font-weight: 800;
        }

        h2 {
          padding-left: 10px;
          font-weight: 200;
        }

        h1.organization-title {
          display: none;
        }

        h1.with-chevron-before,
        p {
          padding-left: 30px;
        }

        h1.with-chevron-before {
          position: relative;

          &::before {
            position: absolute;
            content: " ";
            left: 10px;
            top: 8px;
            width: 8px;
            height: 32px;
            background-image: url(/images/chevron-big-right-dark@2x.png); 
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }

        p {
          content: " ";
          display: inline-block;
          min-height: 50px;
        }
      }

      .right-side {
        button.btn {
          margin-top: 11px;
        }
      }
    }
  }
`;
