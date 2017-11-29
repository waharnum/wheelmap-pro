import * as React from 'react';
import styled from 'styled-components';
import {AutoForm, AutoField, ErrorsField} from 'uniforms-bootstrap3';
import {t} from 'c-3po';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../IStyledComponent';
import {pickFields} from '../../../both/lib/simpl-schema-filter';
import {AccessibilitySchemaExtension} from '@sozialhelden/ac-format';


type Props = {
  model?: any | null,
  schema: SimpleSchema,
  fields: Array<string>,
} & IStyledComponent;

type State = {
  history: Array<{}>,
  progress: number,
  currentIndex: number,
  activeField: string | null,
  model: any,
} & IStyledComponent;

class Questionnaire extends React.Component<Props, State> {
  public state: State = {
    history: [],
    progress: 0,
    currentIndex: -1,
    activeField: null,
    model: {
      properties: {},
    },
  };

  constructor(props: Props) {
    super(props);

    // console.log(props.schema.mergedSchema());
    // TODO handle initial value here, similar to componentWillReceiveProps
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.schema != nextProps.schema) {
      (window as any).__schema = nextProps.schema;

      console.log(nextProps.fields);

      const firstKey = nextProps.fields[0];

      this.setState({
        history: [],
        currentIndex: 0,
        progress: 0,
        activeField: firstKey,
      });
    }
  }

  determineNextField = () => {
    const nextIndex = this.state.currentIndex + 1;
    this.setState({
      currentIndex: nextIndex,
      progress: nextIndex / this.props.fields.length,
      activeField: this.props.fields[nextIndex],
    });
  };

  historySection(field: string) {
    return (<div></div>);
  }

  valueEntrySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;
    const isOptional = definition.optional === true;

    const accessibility = definition.accessibility;
    const question: string | string[] =
      (accessibility && accessibility.question) ||
      t`Please specify the value for \`${label}\`.`;

    const subSchema = pickFields(this.props.schema, [field]);

    return (
      <section className="questionnaire-step">
        <AutoForm
          placeholder={true}
          model={this.state.model}
          onSubmit={(f, v) => console.log('Submitted', f, v)}
          schema={subSchema}>
          <h3 className="question">{question}</h3>
          <AutoField
            label={false}
            name={field}/>
          <ErrorsField/>
        </AutoForm>
        {isOptional ? <button className="secondary" onClick={this.determineNextField}>{t`Skip`}</button> : null}
      </section>
    );
  }

  enterBlockSection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;

    const accessibility = definition.accessibility;
    const question: string | string[] =
      (accessibility && accessibility.questionBlockBegin) ||
      t`Do you wanna answer stuff for the block \`${label}\`?`;

    return (
      <section className="questionnaire-step">
        <h3 className="question">{question}</h3>
        <button className="secondary" onClick={this.determineNextField}>{t`YES PLEASE`}</button>
      </section>
    );
  }

  enterArraySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;

    const accessibility = definition.accessibility;
    const question: string | string[] =
      (accessibility && accessibility.questionBlockBegin) ||
      t`Do you wanna add (another) stuff for the block \`${label}\`?`;

    return (
      <section className="questionnaire-step">
        <h3 className="question">{question}</h3>
        <button className="secondary" onClick={this.determineNextField}>{t`YES PLEASE`}</button>
      </section>
    );
  }

  public render() {
    let displayField: JSX.Element | null = null;
    if (this.state.activeField) {
      const definition = this.props.schema.getDefinition(this.state.activeField);
      const type = this.props.schema.getQuickTypeForKey(this.state.activeField);
      if (type === 'objectArray') {
        displayField = this.enterArraySection(this.state.activeField);
      } else if (type) {
        displayField = this.valueEntrySection(this.state.activeField);
      } else {
        // schema subfields are undefined
        displayField = this.enterBlockSection(this.state.activeField);
      }
    }

    console.log(this.state.model);

    return (
      <div className={`questionnaire-area ${this.props.className}`}>
        <header className="questionnaire-progress">
        <span className="progress-information">
          <figure className="progress-done">{Math.floor(this.state.progress * 100)}</figure>
          <h1 className="place-name">Add new place</h1>
        </span>
          <span className="progress-bar">
          <div className="progress-done" style={{width: `${this.state.progress * 100}%`}}/>
        </span>
        </header>
        <div className="questionnaire-column">
          {displayField}
          <footer className="questionnaire-status">
            <span className="time-left">
              <figure className="minutes">12</figure>
              <small>min left to complete</small>
              <small className="more-specific">this place</small>
            </span>
            <span className="footer-actions">
              <button>{t`Stop here`}</button>
              <button>{t`Skip block`}</button>
            </span>
          </footer>
        </div>
      </div>
    );
  }
}

export default styled(Questionnaire) `

  background-color: ${colors.bgGrey};

  &.questionnaire-area {
    color: ${colors.bgAnthracite};
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);

    margin: 5px;
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
    
    form .form-group, 
    form .form-input {
      width: unset;
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
        border: none;
        border-bottom: 2px solid ${colors.linkBlue};
      }

      &:focus {
        border: none;
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

    input::placeholder,
    ::-webkit-input-placeholder, /* Chrome/Opera/Safari */
    ::-moz-placeholder, /* Firefox 19+ */
    :-ms-input-placeholder, /* Internet Explorer 10-11 */
    ::-ms-input-placeholder  /* Microsoft Edge */
    {
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
        content: " ß";
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

  header.questionnaire-progress {
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
        height: 4px;
        font-size: 2px;
        background-color: ${colors.linkBlue};
      }
    }
  }

  section.questionnaire-step,
  footer.questionnaire-status {
    padding: 16px;
  }

  section.questionnaire-step {
    box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey};

    span.call-to-action .form .form-group {
      margin-top: 1em;
      margin-bottom: 0;
      display: flex;
      align-items: center;
    }
  }

  section.questionnaire-step.next-block {
    display: none;
  }

  footer.questionnaire-status {
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
