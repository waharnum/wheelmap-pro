import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface Props {
  bodyText: string;
  className?: string;
};

const AppLayoutPublicOrganization = (props: Props) => (
  <div className={`${props.className}`}>
    <header className="main-header on-white for-organization">
      <div className="title-bar">
        <div className="organisation-logo"></div>
        <div className="meta-information">
          <h1>Canadian Abilities Foundation</h1>
          <p>We are an international organization for medical emergency relief. We provide medical emergency assistance in crisis and war zones. We collect medical facilities.</p>
        </div>
      </div>
      <div className="wrapper">
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

export default styled(AppLayoutPublicOrganization) `

/* ----------------------------- base header styles -----------------------------*/

header.main-header {
  padding-left: 24px;

  .title-bar {
    display: flex;
    
    .organisation-logo {
      flex-shrink: 0;
      background-image: url(/images/organisations/logo-abilities.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

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
}

/* ----------------------------- dark admin version -----------------------*/

.main-header.on-dark {
  min-height: 128px;
  color: #DEE1E7;
  background-color: #37404D;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  a {
    color: #DEE1E7;
  }

  .title-bar {
    
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
 
  .wrapper ol.secondary-tools li.public-view::before {
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

  .title-bar {
    flex-direction: column;
    justify-content: flex-end;
    
    .organisation-logo {
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
        max-width: 540px;
      }
    }
  }

  .wrapper {
    position: absolute;
    display: inline-block;
    right: 0;
    top: 0;

    ol.secondary-tools li.public-view::before {
      background-image: url(/images/icon-admin-view@2x.png); 
    }
  }
}

/* ----------------- white public organization version -----------------------*/

.main-header.for-organization {
  .title-bar {
    flex-direction: column;
    justify-content: flex-end;
    
    .organisation-logo {
      width: 192px; /* FIXME: width should be dynamic */
      height: 105px;
    }
    
    .meta-information h1 {
      margin-bottom: 4px;
      margin-top: 0px;
    }
  }
}


/* --------------------- white public event version --------------------------*/

.main-header.for-event {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title-bar {
    padding-top: 20px;
    flex-direction: row;
    justify-content: flex-start;
    
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
