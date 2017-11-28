import { t } from 'c-3po';
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';
import { Accounts } from 'meteor/std:accounts-ui';
import styled from 'styled-components';
import { IStyledComponent } from '../../components/IStyledComponent';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import { colors } from '../../stylesheets/colors';

const QuestionaireTestPage = (props: IStyledComponent & { user: Meteor.User, ready: boolean }) => {
  return (
    <ScrollableLayout id="Questionaire" className={props.className}>
      <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>} />
      <div className="content-area scrollable">
        <div className='questionaire-area'>
          <header className='questionaire-progress'>
            <span className='progress-information'>
              <figure className='progress-done'>12</figure>
              <h1 className='place-name'>Add new place</h1>
            </span>
            <span className='progress-bar'>
              <div className='progress-done'></div>
            </span>
          </header>
          <div className='questionaire-column'>
            <section className='questionaire-step onboarding'>
              <h3 className='question'>Carla, this is your first place to be mapped! Please answer some questions:</h3>
            </section>
            <section className='questionaire-step next-block'>
              <h2 className='block-name'>Collect place information</h2>
            </section>
            <section className='questionaire-step simple-choice'>
              <h3 className='question'>Is the owner or somebody responsible here?</h3>
              <span className='call-to-action'>
                <div className='form'>
                  <div className='form-group'>
                    <button className='primary'>yes</button>
                    <button className='primary'>no</button>
                    <button className='secondary'>skip</button>
                  </div>
                </div>
              </span>
            </section>
            <section className='questionaire-step string-input'>
              <h3 className='question'>What is the name of this place?</h3>
              <span className='call-to-action'>
                <div className='form'>
                  <div className='form-group'>
                    <input className='form-control' name='placeName' placeholder='e.g. Doctor Smith' />
                    <button className='secondary'>skip</button>
                  </div>
                </div>
              </span>
            </section>
            <section className='questionaire-step select'>
              <h3 className='question'>What kind of place is this?</h3>
              <span className='call-to-action'>
                <div className='form'>
                  <div className='form-group'>
                    <span className='selectWrapper'>
                      <select className='form-control' name='selectCategory'>
                        <option value="" disabled selected>Please select</option>
                        <option value='Education'>Education</option>
                        <option value='FoodAndDrinks'>Food and Drinks</option>
                        <option value='Health'>Health</option>
                        <option value='Hotels'>Hotels</option>
                        <option value='Leisure'>Leisure</option>
                        <option value='Money'>Money</option>
                        <option value='Other'>Other</option>
                        <option value='Official'>Official</option>
                        <option value='Shopping'>Shopping</option>
                        <option value='Sports'>Sports</option>
                        <option value='Tourism'>Tourism</option>
                        <option value='Travel'>Travel</option>
                      </select>
                    </span>
                    <button className='secondary'>skip</button>
                  </div>
                </div>
              </span>
            </section>
            <footer className='questionaire-status'>
              <span className='time-left'>
                <figure className='minutes'>12</figure>
                <small>min left to complete</small>
                <small className='more-specific'>this place</small>
              </span>
              <span className='footer-actions'>
                <button>stop here</button>
                <button>skip block</button>
              </span>
            </footer>
          </div>
        </div>
      </div>
    </ScrollableLayout>
  );
};

export default styled(QuestionaireTestPage) `

  background-color: ${colors.bgGrey};

  .questionaire-area {
    color: ${colors.bgAnthracite};
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);

    margin-top: 20px; /* testing mobile widths */
    margin-left: 20px; /* testing mobile widths */
    max-width: 375px; /* testing mobile widths */

    h1 {
      font-size: 18px;
      letter-spacing: -0.32px;
    }
   
    h3 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.51px;
      line-height: 29px;
    }
    
    section.onboarding h3 {
      font-weight: 300;
      opacity: 0.8;
    }

    button {
      flex-grow: 1;
      padding: 0 10px;
      margin-right: 4px;
      line-height: 2em;
      font-size: 21px;
      font-weight: 400;
      text-transform: uppercase;
      color: ${colors.linkBlue};
      background-color: white;
      border: 1px solid ${colors.linkBlue};
      border-radius: 4px;
      transition: color 0.25s, background-color 0.25s;

      &:hover,
      &:active {
        color: white;
        background: ${colors.linkBlue};
        transition: color 0.25s, background-color 0.25s;
      }
    }
    
    button.secondary {
      /* color: #8B8B8C; */
      flex-grow:0;
      color: ${colors.bgAnthracite};
      opacity: 0.4;
      border: none;
      transition: color 0.25s, background-color 0.25s, opacity 0.25s;

      &:hover,
      &:active {
        opacity: 1;
        color: white;
        background: ${colors.bgAnthracite};
        transition: color 0.25s, background-color 0.25s, opacity 0.25s;
      }
    }

    input,
    select {
      padding: 0;

      font-size: 21px;
      font-weight: 400;
      text-overflow: ellipsis;
      -webkit-appearance: none; /* default arrows get hidden */
      -moz-appearance: none; /* default arrows get hidden */
      border-radius: 0;
      box-shadow: none;
      border: none;
      border-bottom: 2px solid ${colors.shadowGrey};
      transition: border 0.5s, color 0.5s;
  
      &:hover {
        border-bottom: 2px solid ${colors.linkBlue};
      }

      &:focus,
      &:hover {
        transition: border 0.5s, color 0.5s;
      }

      &:focus {
        border-bottom: 2px solid ${colors.linkBlue};
        color: ${colors.white100};
        outline-offset: 0;
        outline-style: none;
      }

      &:disabled {
        opacity: 0.5;
      }
    }

    input {
      line-height: 1.25em;
    }

    input::placeholder {
      font-weight: 300;
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      font-weight: 300;
    }

    ::-moz-placeholder {  /* Firefox 19+ */
      font-weight: 300;
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      font-weight: 300;
    }
    
    ::-ms-input-placeholder { /* Microsoft Edge */
      font-weight: 300;
    }

    input::-ms-clear {
      display: none;
    }

    span.selectWrapper {
      flex-grow: 1;
      position: relative;
      display: flex;

      &:after {
        content: "ß";
        position: absolute;
        top: 0.2em;
        right: 2px;
        text-align: center;
        -moz-line-height: 0;
        color: ${colors.linkBlue};
        font-family: 'iconfield-V03';
        transition: color 0.5s;
        pointer-events: none;
      }

      &:hover select{
        border-bottom: 2px solid ${colors.linkBlue};
        transition: color 0.5s;
      }
    }

    select {
      flex-grow: 1;
      cursor: pointer;

      option {
        outline: none;
      }


    }
  }
  
  header.questionaire-progress {
    height: 40px;  
    padding: 4px 16px;
    display: flex;
    flex-direction: column;
    
    span.progress-information {
      font-size: 18px;
      font-weight: 800;
      line-height: 24px;
      display: flex;
    
      figure.progress-done {
        color: ${colors.linkBlue};
        padding-right: 10px;

        &:after {
          content: '%';
          right: 0;
          font-size: 12px;
          letter-spacing: 0;
        }
      }
      
      h1.place-name {
        font-weight: 800;
        line-height: 24px;
        margin: 0;
      }
    }
    
    span.progress-bar {
      height: 3px;
      width: 100%;
      background-color: ${colors.shadowGrey};
      box-shadow: none;

      .progress-done {
        content: ' ';
        width: 50%; /* testing styling */
        height: 4px;
        font-size: 2px;
        background-color: ${colors.linkBlue};
      }
    }
  }
  
  section.questionaire-step,
  footer.questionaire-status {
    padding: 16px;
  }
  
  section.questionaire-step {
    box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey};

    span.call-to-action .form .form-group {      
      margin-top: 1em;
      margin-bottom: 0;
      display: flex;
      align-items: center;
    }
  }

  section.questionaire-step.next-block {
    display: none;
  }
  
  footer.questionaire-status {
    padding-top: 0;
    padding-bottom: 0;
    line-height: 42px;
    
    display: flex;
    justify-content: space-between;

    span.time-left {
      display: flex;

      figure.minutes {
        padding-right: 4px;
        font-weight: 800;
        opacity: 0.5;
      }  
      
      small.more-specific {
        display: none;
      }
    }

    span.footer-actions {
      display: flex;
      flex-direction: row-reverse;

      button {
        padding: 0 8px;
        margin-right: 0px;
        line-height: 1em;
        font-size: 14px;
        letter-spacing: -0.33px;
        border: none;
        transition: color 0.25s, background-color 0.25s;

        &:hover,
        &:active {
          color: ${colors.linkBlueDarker};
          background: none;
          transition: color 0.25s, background-color 0.25s;
        }
      }
    }
  }

`;