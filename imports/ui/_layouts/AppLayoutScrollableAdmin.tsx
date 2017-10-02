import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface Props {
  bodyText: string;
  className?: string;
};

const AppLayoutScrollableAdmin = (props: Props) => (
  <div className={`${props.className}`}>
    <header className="main-header on-dark">
      <div className="left-side">
        <div className="title-bar">
          <div className="organization-logo">
          </div>
          <h1>Canadian Abilities Foundation</h1>
        </div>
        <ol className="tabs-header">
          <li className="active"><a href=".">Dashboard</a></li>
          <li><a href=".">Statistics</a></li>
          <li><a href=".">Customize</a></li>
        </ol>
      </div>
      <div className="right-side">
        <ol className="secondary-tools">
          <li className="public-view"><a href="." >Public view</a></li>
          <li className="user-menu"><a href="#" >Alex Bright</a></li>
        </ol>
      </div>
    </header>
    <div className="content-area scrollable">
      <article>{props.bodyText}</article>
    </div>
  </div>
);

export default styled(AppLayoutScrollableAdmin) `

/* ----------------------------- base header styles -----------------------------*/

header.main-header {
  padding: 0 24px 8px 24px;
  display: flex;
  justify-content: space-between;

  .title-bar {
    display: flex;
    
    .organization-logo {
      flex-shrink: 0;
      background-image: url(/images/organizations/logo-abilities.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
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

      .organization-logo {
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

/* ----------------------------- white public version -----------------------*/

.main-header.on-white{
  min-height: 128px;
  position: relative;
  color: #37404D;
  background-color: white;

  a {
    color: #37404D;
  }

  a.btn-primary {
    color: white;
  }

  .title-bar {
    flex-direction: column;
    justify-content: flex-end;
    
    .organization-logo {
      width: 192px; /* FIXME: width should be dynamic */
      height: 105px;
    }
    
    .meta-information {

      h1 {     
        font-size: 28px;
        line-height: 28px;
        font-weight: 300;
      }
      
      p {
        font-size: 14px;
        font-weight: 400;
        // max-width: 540px;
      }
    }
  }

  .right-side ol.secondary-tools li.public-view::before {
      background-image: url(/images/icon-admin-view@2x.png); 
    }
  }
}

/* ----------------- white public organization version -----------------------*/

.main-header.for-organization {

  .left-side {
    display: flex;

    .title-bar {
      flex-direction: column;
      justify-content: flex-end;
      
      .organization-logo {
        width: 192px; /* FIXME: width should be dynamic */
        height: 105px;
      }
      
      .meta-information h1 {
        margin-bottom: 4px;
        margin-top: 0px;
      }
    }
  }  

  .right-side a.btn-primary {
    margin-bottom: 10px;
    margin-left: 12px;
  }
}


/* --------------------- white public event version --------------------------*/

.main-header.for-event {

  .title-bar {
    padding-top: 20px;
    flex-direction: row;
    justify-content: flex-start;
    
    .organization-logo {
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
        background-image: url(/images/chevron-big-right-dark@2x.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    .meta-information {
      max-width: 400px;
    
      h1 {
        margin: 0;
        padding-top: 11px;
        padding-bottom: 4px;
      }
    }
  }
}

/* ----------------------------- more layout styles -----------------------*/

.content-area {
  padding: 24px;
  
}

.scrollable {

}

`;
