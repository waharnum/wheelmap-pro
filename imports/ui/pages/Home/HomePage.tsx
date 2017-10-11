import {t} from 'c-3po';
import * as React from 'react';

import Button from '../../components/Button';
import {Link} from 'react-router';
import {colors} from '../../stylesheets/colors';
import UserMenu from '../../components/UserMenu';
import styled from 'styled-components';

const HomePage = (props) => (
  <div className={`${props.className}`} id="HomePage">
    <header className="header beforeLogin onHomepage">
      <span className="logo">
        <h1>{t`wheelmap.pro`}</h1>
      </span>
      <UserMenu/>
    </header>
    <div className="wrapper sawblade">
      <section className="hero-banner">
        <div className="wrapper">
          <div className="hero-image"/>
          <h2>{t`Like Wheelmap but customized to fit your own community.`}</h2>
          <p>{t`Which public places are accessible for people with disabilities? Create your own mapping community and empower your volunteers to go out and mark the accessibility of places! Wheelmap Pro is a powerful tool with your own brand, your specific accessibility criteria and step-by-step action plans.`}</p>
          <Button to="/organizations/create" className="btn-primary">{t`Create your community`}</Button>
        </div>
      </section>
    </div>
    <div className="wrapper onGreen">
      <section className="explainSteps">
        <article className="explainStep step1">
          <h2>{t`Step 1.`}</h2>
          <p>{t`Start a new mapping community or join a community as a volunteer. We help you plan and organize successful mapping events for collecting accessibility data.`}</p>
          <img src="/images/comic-step1@2x.png" width="246px" height="202px"/>
        </article>
        <article className="explainStep step2">
          <h2>{t`Step 2.`}</h2>
          <p>{t`Invite volunteers to mapping events during which groups evaluate the accessibility of local public places.`}</p>
          <img src="/images/comic-step2@2x.png" width="246px" height="202px"/>
        </article>
        <article className="explainStep step3">
          <h2>{t`Step 3.`}</h2>
          <p>{t`The accessibility information which your community gathers can then be shared publicly to help people with and without disabilities to navigate the world.`}</p>
          <img src="/images/comic-step3@2x.png" width="246px" height="202px"/>
        </article>
      </section>
    </div>
    <div className="wrapper onDarkGrey">
      <section className="videoIntroduction">
        <h2>{t`Watch a short video introduction.`}</h2>
        <div className="media">
          <div className="media-left">
          </div>
        </div>
      </section>
    </div>
    <section className="partners">
      <a href="." className="partnerLogo jaccede"/>
      <a href="." className="partnerLogo foursquare"></a>
      <a href="." className="partnerLogo axsmap"/>
      <a href="." className="partnerLogo wheelmap"/>
      <a href="." className="partnerLogo google"/>
    </section>
    <div className="wrapper onDarkGrey">
      <footer>
        <div className="wrapper">
          <Link to="/" className="onDark">{t`About us`}</Link>
          <Link to="/" className="onDark">{t`Imprint`}</Link>
        </div>
      </footer>
    </div>
  </div>
);

export default styled(HomePage) `

  overflow: auto;
  width: 100%;

  .alert {
    position: absolute;
    top: 10px;
    left: 40%;
    text-align: center;
    font-weight: 500;
    background: white;
  }

  h1, 
  h2 {
    color: ${colors.bgAnthracite};
    font-weight: 800;
    font-size: 28px;
  }

  header,
  section {
    max-width: 1260px;
    margin-left: auto;
    margin-right: auto;
  }

  header.onHomepage {
    display: flex;
    justify-content: space-between;

    span.logo {
      content: " ";
      width: 309px;
      min-width: 309px;
      height: 82px;
      background-image: url(/images/logo-wheelmappro@2x.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;     

      h1 {
        visibility: hidden;
        font-size: 24px;
        line-height: 24px !important;
        font-weight: 800 !important;
        letter-spacing: -1px;
      }
    }

    .dropdown {
      right: 10px;
      top: 10px;
    }

    li.login-menu, li.user-menu {
      padding-top: 10px;

      a {
        display: inline-block;
        color: ${colors.bgAnthracite};
        padding: 20px 10px;
        text-transform: uppercase;
      }
    }
  }
  
  .sawblade {
    background-image: url(/images/bg-star.svg); 
    background-position: top center;
    background-repeat: no-repeat;
    background-size: 140% 140%;
    image-rendering: -moz-crisp-edges; /* Prevents Firefox from pixeling edges */

    section.hero-banner {
      padding: 0 20px 20px 20px;
      text-align: center;

      .wrapper {
        display: flex;
        flex-direction: column;
        justify-items: flex-end;
        align-items: center;
      }

      .hero-image {
        content: " ";
        width: 491px;
        height: 244px;
        background-image: url(/images/comic-hero@2x.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      p {
        max-width: 44em;
        font-weight: 400;
        font-size: 18px;
      }

      .btn-primary {
        margin: 34px 0;
      }
    }
  }

  .wrapper.onGreen {
    background-color: ${colors.ctaGreen};

    section.explainSteps {
      display: flex;
      flex-wrap: wrap; 
      
      &:last-child: {
        border: none;
      }
      
      .explainStep {
        position: relative;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 24px;

        h2,
        p {
          color: white;
        }
        
        p { 
          max-width: 20em;
          font-weight: 400;
        }
      }
      
      .step1 {
        background-color: ${colors.ctaGreen};
      }
    
      .step2 {
        // background-color: #A8CC45;
      }
    
      .step3 {
        // background-color: #B1D649;
      }

      article {
        flex-basis: 33.33%;
        padding: 0 20px 20px 20px;
        position: relative;
      }
    }
  }

  .onDarkGrey  {
    color: white;
    background-color: ${colors.bgAnthracite};
  }

  section.videoIntroduction {
    padding: 42px 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    flex-wrap: wrap;

    h2 {
      color: white;
      position: relative;
      padding-left: 8px;
      max-width: 15em;
      min-width: 10em;
      font-weight: 200;
      font-size: 28px;
      text-align: center;

      &:after { /* curved line */
        position: absolute;
        content: " ";
        width: 164px;
        height: 95px;
        top: 80px;
        left: 20px;
        background-image: url(/images/hintLine.svg); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        opacity: 0.5;
      }
    }

    .media {
      margin: auto;
      flex-shrink: 0;

      .media-left {
        content: " ";
        width: 557px;
        min-width: 557px;
        height: 348px;
        background-image: url(/images/videoPreview@2x.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }

  section.partners {
    padding: 20px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    a {
      flex-shrink: 0;
      position: relative;
      height: 52px;
      margin-right: 10px;
      margin-bottom: 10px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      mix-blend-mode: multiply;

      &:before {  // desaturates logos
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: inherit;
        -webkit-filter: grayscale(1); 
        -webkit-filter: grayscale(100%); 
        -moz-filter: grayscale(100%);
        filter: gray; 
        filter: grayscale(100%);
      }
    }

    a.jaccede {
      width: 52px;
      min-width: 52px;
      background-image: url(/images/partners/logo-jaccede.png); 
    }

    a.foursquare {
      width: 70px;
      min-width: 70px;
      background-image: url(/images/partners/logo-foursquare.png); 
    }

    a.axsmap {
      width: 150px;
      min-width: 150px;
      background-image: url(/images/partners/logo-axsmap.png); 
    }

    a.wheelmap {
      width: 181px;
      min-width: 181px;
      background-image: url(/images/partners/logo-wheelmap.png); 
    }

    a.google {
      width: 153px;
      min-width: 153px;
      background-image: url(/images/partners/logo-google.png); 
    }

    a.iwheelshare {
      width: 181px;
      min-width: 181px;
      background-image: url(/images/partners/logo-iwheelshare.png); 
    }
  }

  footer {
    min-height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      font-weight: 400;
      color: white;
      padding: 0 20px;
    }
  }

  @media only screen and (max-width: 1285px) {

    
  }

`;
