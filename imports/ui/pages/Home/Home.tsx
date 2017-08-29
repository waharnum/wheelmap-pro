import * as React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { Link } from 'react-router';
import TextBlock from './TextBlock';

const Home = (props) => (
  <div className={`${props.className}`}>
    <div className="alert alert-primary hidden" role="alert">
      This is a primary alert—check it out!
    </div>
    <header className="header beforeLogin onHomepage">
        <span className="logo">
          <h1>make accessible maps</h1>
        </span>
        <span className="loginState">
          {!Meteor.user() ? <Link to="/signup" className="onDark">Sign Up</Link> : null}
          {!Meteor.user() ? <Link to="/signin" className="onDark">Sign In</Link> : null}
          {Meteor.user() ? <Link to="/profile" className="onDark">Profile</Link> : null}
        </span> 
    </header>
    <div className="wrapper sawblade">
      <section className="hero-banner">
        <div className="wrapper">
          <h2>Let’s build comunities to map and spread accessibity.</h2>
          <p>We are a NGO that believes in an inclusive world. Our mission is to make accessibility information easier to find—wherever people need it. That’s why we want to encourage everybody to share this kind of data with each other.</p>
          <Button to="/organizations/create" className="btn-primary">start here</Button>
        </div>
      </section>
    </div>
    <section className="explainSteps">
      <article className="explainStep onBlue">
        <h2>Step 1.</h2>
        <p>Join one a community as a volunteer or start a new comunity. We help you to plan and organize mapping events for accessibility data.</p>
      </article>
      <article className="explainStep onGreen">
        <h2>Step 2.</h2>
        <p>Invite volunteers to mapping-events where groups investigate an area for its accessibility.</p>
      </article>
      <article className="explainStep onYellow">
        <h2>Step 3.</h2>
        <p>This gathered information can then be shared publictly to help people with with and without disabilities to navigate the world.</p>
      </article>
    </section>
    <div className="wrapper onLightGrey">
      <section className="videoIntroduction">
        <h2>Watch a short video introduction.</h2>
        <div className="Media">
          <div className="media-left">

          </div>
        </div>
      </section>
    </div>
    <section className="partners">
      <a href="." className="partnerLogo jaccede"></a>
      <a href="." className="partnerLogo foursquare"></a>
      <a href="." className="partnerLogo axsmap"></a>
      <a href="." className="partnerLogo wheelmap"></a>
      <a href="." className="partnerLogo google"></a>
    </section>
    <div className="wrapper onDarkGrey">
      <footer>
        <div className="wrapper">
          <Link to="/" className="onDark">About us</Link>
          <Link to="/" className="onDark">Imprint</Link>
        </div>
      </footer>
    </div>
  </div>
);

export default styled(Home) `

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
    font-weight: 800;
    font-size: 36px;
  }

  header,
  section {
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
  }

  header {
    display: flex;
    justify-content: space-between;

    span.logo {
      max-width: 200px;
      position: relative;
      padding-left: 72px;
      
      &:before {
        content: " ";
        width: 57px;
        height: 86px;
        position: absolute;
        left: 10px;
        top: 20px;
        background-image: url(/images/logo-balloon@2x.png); 
        background-position: top center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      h1 {
        word-spacing: 10000px; 
        font-size: 24px;
        line-height: 24px !important;
        font-weight: 800 !important;
        letter-spacing: -1px;
      }
    }

    span.loginState {
      padding: 20px 0;
      color: red;
    }
  }
  
  .sawblade {
    background-image: url(/images/bg-star.svg); 
    background-position: top center;
    background-repeat: no-repeat;
    background-size: 140% 140%;
    image-rendering: -moz-crisp-edges; /* Prevents Firefox from pixeling edges */

    section.hero-banner {
      min-height: 640px;
      padding: 0 20px 20px 20px;
      text-align: center;
      display: flex;
      align-items: flex-end;

      p {
        font-weight: 400;
        font-size: 18px;
      }

      .btn-primary {
        margin: 34px 0;
      }
    }
  }

  section.explainSteps {
    display: flex;

    article {
      flex-basis: 33.33%;
      padding: 0 20px 20px 20px;
      position: relative;

      &:after {
        position: relative;
        content: " ";
        width: 256px;
        height: 160px;
        bottom: 0;
        background-image: url(/images/image-placeholder.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

    }
  }
  
  .onBlue {
    background-color: #C6E7E0;
  }

  .onGreen {
    background-color: #E6EFC6;
  }

  .onYellow {
    background-color: #F7E9AD;
  }

  .onLightGrey {
    background-color: #E1E2E4;
  }

  .onDarkGrey {
    background-color: #37404D;
  }

  section.videoIntroduction {
    padding: 42px 20px;
    display: flex;
    flex-direction: row-reverse;

    h2 {
      position: relative;
      color: #29A3CB;
      font-weight: 200;
      font-size: 28px;
      text-align: center;

      &:after {
        position: absolute;
        content: " ";
        width: 164px;
        height: 95px;
        top: 60px;
        left: 0;
        background-image: url(/images/hintLine.svg); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    .media-left {
      flex-basis: 557px;
      content: " ";
      width: 557px;
      height: 348px;
      background-image: url(/images/videoPreview@2x.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  section.partners {
    padding: 20px;
    display: flex;
    justify-content: space-between;

    a {
      position: relative;
      height: 52px;
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
      background-image: url(/images/partners/logo-jaccede.png); 
    }

    a.foursquare {
      width: 70px;
      background-image: url(/images/partners/logo-foursquare.png); 
    }

    a.axsmap {
      width: 150px;
      background-image: url(/images/partners/logo-axsmap.png); 
    }

    a.wheelmap {
      width: 181px;
      background-image: url(/images/partners/logo-wheelmap.png); 
    }

    a.google {
      width: 153px;
      background-image: url(/images/partners/logo-google.png); 
    }

    a.iwheelshare {
      width: 181px;
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
`;
