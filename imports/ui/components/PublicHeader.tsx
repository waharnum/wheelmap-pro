import * as React from 'react';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';
import PreviewToggle from './PreviewToggle';
import UserMenu from './UserMenu';
import AdminTab from './AdminTab';
import {LocationDescriptor} from 'history';

interface IPublicHeaderProps {
  titleComponent: JSX.Element | string;
  organizeLink?: LocationDescriptor;
}

interface IHeaderTitleProps {
  title: string;
  logo?: JSX.Element;
}

export const HeaderTitle = (props: IHeaderTitleProps) => {
  return (
    <div>
      {props.logo}
      <h1>{props.title}</h1>
    </div>
  );
};

const PublicHeader = (props: IPublicHeaderProps & IStyledComponent) => {
  return (
    <div className={props.className} >
      <header className="main-header on-white">
        <div className="wrapper">
          <ol className="secondary-tools">
            <PreviewToggle to={props.organizeLink} toOrganize={true} />
            <UserMenu />
          </ol>
        </div>
        <div className="title-bar">
          {props.titleComponent || <HeaderTitle title="Please specificy title component" />}
        </div>
      </header>
    </div>
  );
};

export default styled(PublicHeader) `
  header {
    padding-left: 24px;
  }

  .main-header {
    min-height: 128px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .wrapper {
      display: flex;
      justify-content: flex-end;

      ol.secondary-tools {
        margin:  0;
        text-transform: uppercase;
      }
    }

    .title-bar {
      display: flex;
      
      .organisation-logo {
        flex-shrink: 0;
        position: relative;
        width: 95px;
        height: 52px;
        margin-right: 30px;
        background-image: url(/images/organisations/logo-abilities.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        
        &::after {
          position: absolute;
          content: " ";
          right: -19px;
          top: 8px;
          width: 8px;
          height: 32px;
          background-image: url(/images/chevron-big-right@2x.png); 
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

  .on-white {
    color: #37404D;
    background-color: #FFF;

    a {
      color: #37404D;
    }
  }
`;
