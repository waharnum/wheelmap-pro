import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface Props {
  headerTitle: string;
  bodyText: string;
  className?: string;
};

const AppLayoutScrollable = (props: Props) => (
  <div className={`${props.className}`}>
    <header className="main-header on-dark">
      <div className="wrapper">
        <ol className="secondary-tools">
          <li className="public-view"><a href="." >Public view</a></li>
          <li className="user-menu"><a href="#" >Alex Bright</a></li>
        </ol>
      </div>
      <div className="title-bar">
        <div className="organisation-logo">
        </div>
        <h1>Canadian Abilities Foundation</h1>
      </div>
      <ol className="tabs-header">
        <li className="active"><a href=".">Dashboard</a></li>
        <li><a href=".">Statistics</a></li>
        <li><a href=".">Customize</a></li>
      </ol>
    </header>
    <div className="content-area scrollable">
      <article>{props.bodyText}</article>
    </div>
  </div>
);

export default styled(AppLayoutScrollable) `

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
          padding-right: 26px;

          &::after {
            position: absolute;
            right: 10px;
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

.on-dark {
  color: #DEE1E7;
  background-color: #37404D;

  a {
    color: #DEE1E7;
  }
}

.content-area {
  padding: 24px;
  
}

.scrollable {

}

`;
