import * as React from 'react';
import styled from 'styled-components';
import {AutoForm, AutoField, ErrorsField, SubmitField} from 'uniforms-bootstrap3';
import {t} from 'c-3po';
import {extend, get, pick, set, concat, sample} from 'lodash';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../IStyledComponent';
import {pickFieldForAutoForm} from '../../../both/lib/simpl-schema-filter';
import {AccessibilitySchemaExtension} from '@sozialhelden/ac-format';
import HistoryEntry from './HistoryEntry';


const affirmativeAnswers: ReadonlyArray<string> = Object.freeze([t`Yes!`, t`Okay!`, t`Sure!`, t`Let's do this!`, t`I'm ready!`]);
const skipAnswers: ReadonlyArray<string> = Object.freeze([t`I'm not sure.`, t`I'll skip this one.`, t`No idea.`, t`Ask me next time.`, t`Phew, I couldn't tell.`]);
const skipBlockAnswers: ReadonlyArray<string> = Object.freeze([t`I'd rather move to the next topic.`, t`I'll skip this block.`]);
const stopQuestionnaireAnswers: ReadonlyArray<string> = Object.freeze([t`I think I'm done.`, t`I've had enough`, t`I answered enough questions!`]);

type HistoryDataEntry = {
  goTo?: {
    index: number,
    arrayIndexes: Array<number>,
  }
  question: string,
  answer: any,
  component?: React.ComponentClass<{ value: any }> | React.StatelessComponent<any>
  className?: string,
};

type Props = {
  model?: any | null,
  schema: SimpleSchema,
  fields: Array<string>,
} & IStyledComponent;

type ContentTypes = 'welcome' | 'enterArray' | 'addToArray' | 'chooseFromArray' | 'enterBlock' | 'valueEntry' | 'done';
type NextFieldMode = 'nextIndex' | 'exitBlock' | 'skipBlock' | 'stop' | 'history';

type State = {
  history: Array<HistoryDataEntry>,
  progress: number,
  currentIndex: number,
  activeField: string | null,
  question: string,
  arrayIndexes: Array<number>,
  mainContent: ContentTypes,
  model: any,
} & IStyledComponent;

/**
 * Takes a simple schema path such as a.$.b.$.c.e.f and array indexes and replaces each occurrence of .$ with [x]
 * where x is the matching value from arrayIndexes.
 *
 * simpleSchemaPathToObjectPath( 'a.$.b.$.c.e.f', [4, 2] ) return 'a[4].b[2].c.e.f'.
 */
const simpleSchemaPathToObjectPath = (simpleSchemaPath: string,
                                      arrayIndexes: Array<number> = [],
                                      defaultValue: number = 0,
                                      options: { wrapInArray: boolean } = {wrapInArray: true}): string => {
  if (!simpleSchemaPath) {
    return '';
  }

  let result = '';
  let index = 0;
  for (const path of simpleSchemaPath.split('.')) {
    if (path === '$') {
      if (options.wrapInArray) {
        result += `[${arrayIndexes[index] || defaultValue}]`;
      } else {
        result += `.${arrayIndexes[index] || defaultValue}`;
      }
      index++;
    } else {
      result += `.${path}`;
    }
  }
  return result.substr(1);
};


class Questionnaire extends React.Component<Props, State> {
  public state: State = {
    history: [],
    progress: 0,
    currentIndex: -1,
    question: '',
    activeField: null,
    arrayIndexes: [],
    mainContent: 'welcome',
    model: {},
  };

  constructor(props: Props) {
    super(props);

    (window as any).__schema = props.schema;
    // TODO handle initial value here, similar to componentWillReceiveProps
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.schema !== nextProps.schema) {
      (window as any).__schema = nextProps.schema;
      // console.log(nextProps.fields);
      this.setState({
        history: [],
        progress: 0,
        currentIndex: -1,
        activeField: null,
        mainContent: 'welcome',
        arrayIndexes: [],
      });
    }
  }

  goToNextField<K extends keyof State>(mode: NextFieldMode, nextState: Pick<State, K>) {
    const currentActiveField: string | null = this.state.activeField;
    let nextIndex: number = -1;
    let shouldCheckForArrayAgain: boolean = true;

    switch (mode) {
      case 'nextIndex':
        nextIndex = this.state.currentIndex + 1;
        break;
      case 'skipBlock':
        if (!currentActiveField || this.state.currentIndex < 0) {
          console.error('Invalid state', this.state, mode);
          return;
        }
        // find next field that is not starting with the currentFields text
        for (let i = this.state.currentIndex; i < this.props.fields.length; i++) {
          if (!this.props.fields[i].startsWith(currentActiveField)) {
            nextIndex = i;
            break;
          }
        }
        break;
      case 'exitBlock':
        if (!currentActiveField || this.state.currentIndex < 0) {
          console.error('Invalid state', this.state, mode);
          return;
        }
        const parentField = currentActiveField.split('.').slice(0, 1).join('.');
        // find next field that is not starting with the currentFields text
        for (let i = this.state.currentIndex; i < this.props.fields.length; i++) {
          if (!this.props.fields[i].startsWith(parentField)) {
            nextIndex = i;
            break;
          }
        }
        break;
      case 'stop':
        shouldCheckForArrayAgain = false;
        nextIndex = this.props.fields.length;
        break;
      case 'history':
        shouldCheckForArrayAgain = false;
        nextIndex = nextState.currentIndex;
        break;
    }

    let nextActiveField: string | null = this.props.fields[nextIndex];

    // are we currently in an array
    let arrayIndexes: Array<number>;
    arrayIndexes = nextState.arrayIndexes || this.state.arrayIndexes;
    if (arrayIndexes.length > 0 && currentActiveField && shouldCheckForArrayAgain) {
      // check array depth in new active field
      let arrayNodesCount = 0;
      if (nextActiveField) {
        for (const path of nextActiveField.split('.')) {
          if (path === '$') {
            arrayNodesCount++;
          }
        }
      }

      // we are leaving an array, try to ask for entries again
      if (arrayIndexes.length > arrayNodesCount) {
        let potentialNextActiveField = currentActiveField;
        while (arrayIndexes.length > 0) {
          potentialNextActiveField = potentialNextActiveField.substr(0, potentialNextActiveField.lastIndexOf('.$.'));
          const foundIndex = this.props.fields.indexOf(potentialNextActiveField);
          arrayIndexes = arrayIndexes.slice(0, arrayNodesCount);
          if (foundIndex) {
            nextActiveField = potentialNextActiveField;
            nextIndex = foundIndex;
            break;
          }
        }
      }
    }

    // determine component to use
    let mainContent: ContentTypes = 'welcome';
    // valid path
    if (nextIndex < this.props.fields.length && nextActiveField) {
      const type = this.props.schema.getQuickTypeForKey(nextActiveField);
      if (type === 'objectArray') {
        mainContent = 'enterArray';
      } else if (type) {
        mainContent = 'valueEntry';
      } else {
        // schema subfields have an undefined quick type
        const definition = this.props.schema.getDefinition(nextActiveField, ['uniforms']);
        // has component defined for uniforms
        if (definition.uniforms && definition.uniforms.component) {
          mainContent = 'valueEntry';
        } else {
          // otherwise enter block
          mainContent = 'enterBlock';
        }
      }
    } else {
      mainContent = 'done';
      arrayIndexes = [];
      nextIndex = this.props.fields.length;
    }

    const question = this.determineQuestion(mainContent, nextActiveField);

    this.setState(extend(nextState, {
      currentIndex: nextIndex,
      progress: nextIndex / this.props.fields.length,
      activeField: nextActiveField,
      question,
      mainContent,
      arrayIndexes,
    }));
  };

  determineQuestion(type: ContentTypes, field: string | null): string | string[] {
    if (!field) {
      return '';
    }

    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;
    const accessibility = definition.accessibility;
    const isOptional = definition.optional === true;
    const currentValue = get(this.state.model, simpleSchemaPathToObjectPath(field));

    let question: string | string[] = '';
    switch (type) {
      case 'valueEntry':
        question = (accessibility && accessibility.question) ||
          t`Please specify the value for \`${label}\`.`;
        break;
      case 'enterBlock':
        question = (accessibility && accessibility.questionBlockBegin) ||
          (accessibility && accessibility.question) ||
          (isOptional ? t`Do you wanna dive into \`${label}\`?` : t`Please specify \`${label}\`.`);
        break;
      case 'enterArray':
        const hasEntries = Array.isArray(currentValue) && currentValue.length > 0;
        const needsMoreEntries = definition.min === true;
        if (hasEntries) {
          question = (accessibility && accessibility.questionMore) ||
            (accessibility && accessibility.question) ||
            (needsMoreEntries ?
              t`Do you wanna add another element to the list \`${label}\` (${currentValue.length})?` :
              t`Please add another element to the list \`${label}\` (${currentValue.length}).`);
        } else {
          question = (accessibility && accessibility.questionBlockBegin) ||
            (accessibility && accessibility.question) ||
            (isOptional ?
              t`Do you wanna add the first element to the list \`${label}\`?` :
              t`Please add the first element to the list \`${label}\`.`);
        }
        break;
    }

    return question;
  }

  historySection() {
    let index = 0;
    const historyItemCount = this.state.history.length;
    return this.state.history.map(entry => {
      index++;
      const isLast = index === historyItemCount;
      let callback: (() => void) | undefined = undefined;
      if (entry.goTo && isLast) {
        callback = this.goToNextField.bind(this, 'history', {
          history: this.state.history.slice(0, -1),
          currentIndex: entry.goTo.index,
          arrayIndexes: entry.goTo.arrayIndexes,
        });
      }

      return (
        <HistoryEntry key={index}
                      question={entry.question}
                      value={entry.answer}
                      className={entry.className}
                      onClick={callback}/>
      );
    });
  }

  submitValue = (field: string, question: string, resultObj: any) => {
    const objectPath = simpleSchemaPathToObjectPath(field, this.state.arrayIndexes);

    console.log('Submitted', JSON.stringify(resultObj), field, objectPath, question);

    const resultValue = get(resultObj, objectPath);
    set(this.state.model, objectPath, resultValue);
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question,
        // TODO  arbitrary, un-translated values, needs to map to whatever the label is
        answer: resultValue,
      }),
      model: this.state.model,
    };

    this.goToNextField('nextIndex', nextState);
  };

  skipField = (field: string, question: string) => {
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question,
        answer: sample(skipAnswers) as string,
        className: 'history-skipped',
      }),
    };

    this.goToNextField('nextIndex', nextState);
  };

  valueEntrySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;
    const isOptional = definition.optional === true;
    const isSelfSubmitting = definition.uniforms && definition.uniforms.selfSubmitting;


    const subSchema = pickFieldForAutoForm(this.props.schema, field);

    const objectPath = simpleSchemaPathToObjectPath(field, this.state.arrayIndexes);
    const subModel = pick(this.state.model, objectPath.split('.'));

    (window as any).__subSchema = subSchema;

    // console.log('subModel', field, objectPath, subModel);
    // console.log('subSchema', field, subSchema);

    /* specify key on AutoForm, so that the form is not reused between fields */
    return (
      <section className={t`questionnaire-step ${isOptional ? 'questionnaire-optional' : 'questionnaire-mandatory'}`}>
        <AutoForm
          key={field}
          placeholder={true}
          onSubmit={this.submitValue.bind(this, field, this.state.question)}
          schema={subSchema}
          model={subModel}>
          <h3 className="question">{this.state.question}</h3>
          <section className={isSelfSubmitting ? 'value-entry-section ves-inline-field' : 'value-entry-section'}>
            <AutoField
              label={false}
              name={simpleSchemaPathToObjectPath(field, this.state.arrayIndexes, 0, {wrapInArray: false})}>
            </AutoField>
            <span className={isSelfSubmitting ? 'call-to-action' : 'call-to-action cta-full-width'}>
              <div className="form">
                <div className="form-group">
                  {!isSelfSubmitting ?
                    <SubmitField className={t`primary-action`} value={t`Submit`}/> : null}
                  {isOptional ?
                    <button className="secondary"
                            onClick={this.skipField.bind(this, field, this.state.question)}>{t`Skip`}</button> : null}
                  <ErrorsField/>
                </div>
              </div>
            </span>
          </section>
        </AutoForm>
      </section>
    );
  }

  enterBlock = (field: string, question: string) => {
    console.log('Entered', field, question);
    // start empty object if not existing yet

    const objectPath = simpleSchemaPathToObjectPath(field, this.state.arrayIndexes);
    set(this.state.model, objectPath, get(this.state.model, objectPath, {}));
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question,
        answer: sample(affirmativeAnswers),
      }),
      model: this.state.model,
    };

    this.goToNextField('nextIndex', nextState);
  };

  enterBlockSection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const isOptional = definition.optional === true;

    return (
      <section className="questionnaire-step">
        <h3 className="question">{this.state.question}</h3>
        <span className="call-to-action">
          <div className="form">
            <div className="form-group">
              {isOptional ?
                [<button key="yes" className="primary"
                         onClick={this.enterBlock.bind(this, field, this.state.question)}>{t`Yes`}</button>,
                  <button key="no" className="primary"
                          onClick={this.skipBlock.bind(this, field, this.state.question)}>{t`No`}</button>] :
                <button className="primary"
                        onClick={this.enterBlock.bind(this, field, this.state.question)}>{t`Okay`}</button>
              }
            </div>
          </div>
        </span>
      </section>
    );
  }

  enterArray = (field: string, question: string, index: number) => {
    console.log('Entered', field, question);

    // start empty object if not existing yet
    const objectPath = simpleSchemaPathToObjectPath(field, this.state.arrayIndexes);
    set(this.state.model, objectPath, get(this.state.model, objectPath, [{}]));

    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question,
        answer: sample(affirmativeAnswers),
      }),
      arrayIndexes: this.state.arrayIndexes.concat([index]),
      model: this.state.model,
    };

    this.goToNextField('nextIndex', nextState);
  };

  skipBlock = (field: string, question: string) => {
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question,
        answer: sample(skipBlockAnswers),
      }),
      model: this.state.model,
    };
    this.goToNextField('skipBlock', nextState);
  };

  enterArraySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;
    const isOptional = definition.optional === true;

    const currentValue = get(this.state.model, simpleSchemaPathToObjectPath(field), []);
    const arrayIndex = currentValue.length;

    return (
      <section className="questionnaire-step">
        <h3 className="question">{this.state.question}</h3>
        <span className="call-to-action">
          <div className='form'>
            <div className='form-group'>
              {isOptional ?
                [<button key="yes" className="primary"
                         onClick={this.enterArray.bind(this, field, this.state.question, arrayIndex)}>{t`Yes`}</button>,
                  <button key="no" className="primary"
                          onClick={this.skipBlock.bind(this, field, this.state.question, arrayIndex)}>{t`No`}</button>] :
                <button className="primary"
                        onClick={this.enterArray.bind(this, field, this.state.question)}>{t`Okay`}</button>
              }
            </div>
          </div>
        </span>
      </section>
    );
  }

  startQuestionnaire = () => {
    console.log('Started');

    const nextState = {
      history: concat(this.state.history, {
        question: t`Welcome text goes here.`,
        answer: sample(affirmativeAnswers),
      }),
      model: this.state.model,
    };

    this.goToNextField('nextIndex', nextState);
  };

  welcomeSection() {
    return (
      <section className="questionnaire-step">
        <h3 className="question">{t`Welcome text goes here.`}</h3>
        <span className="call-to-action">
          <div className='form'>
            <div className='form-group'>
              <button className="primary" onClick={this.startQuestionnaire}>{t`Okay`}</button>
            </div>
          </div>
        </span>
      </section>
    );
  }

  doneSection() {
    return (
      <section className="questionnaire-step">
        <h3 className="question">{t`Well done, you made it through!`}</h3>
        <code>{JSON.stringify(this.state.model, null, 2)}</code>
        <span className="call-to-action">
          <div className='form'>
            <div className='form-group'>
              <button className="primary">{t`What now??`}</button>
            </div>
          </div>
        </span>
      </section>
    );
  }

  exitBlock = () => {
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question: this.state.question,
        answer: sample(skipBlockAnswers),
      }),
    };
    this.goToNextField('exitBlock', nextState);
  };

  stopSurvey = () => {
    const nextState = {
      history: concat(this.state.history, {
        goTo: {
          index: this.state.currentIndex,
          arrayIndexes: this.state.arrayIndexes,
        },
        question: this.state.question,
        answer: sample(stopQuestionnaireAnswers),
      }),
    };
    this.goToNextField('stop', nextState);
  };

  public render() {
    let displayField: JSX.Element | null = null;

    switch (this.state.mainContent) {
      case 'enterArray':
        displayField = this.enterArraySection(this.state.activeField || '');
        break;
      case 'valueEntry':
        displayField = this.valueEntrySection(this.state.activeField || '');
        break;
      case 'enterBlock':
        displayField = this.enterBlockSection(this.state.activeField || '');
        break;
      case 'welcome':
        displayField = this.welcomeSection();
        break;
      case 'done':
        displayField = this.doneSection();
        break;
    }

    // console.log('state:', this.state);

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
        <div className="history-column">
          {this.historySection()}
        </div>
        <div className="questionnaire-column">
          {displayField}
          <footer className="questionnaire-status">
            <span className="time-left">
              <figure className="minutes">12</figure>
              <small>min left to complete</small>
              <small className="more-specific">this place</small>
            </span>
            <span className="footer-actions">
              <button disabled={['welcome', 'done'].includes(this.state.mainContent)}
                      onClick={this.stopSurvey}>{t`Stop here`}</button>
              <button disabled={['welcome', 'done'].includes(this.state.mainContent)}
                      onClick={this.exitBlock}>{t`Skip block`}</button>
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
    
    code {
      overflow: auto;
      width: 100%;
      display: block;
      white-space: pre;
    }
    
    form .form-group, 
    form .form-input {
      width: unset;
      width: 100%;
      margin-bottom: 0;
    }

    section.onboarding h3 {
      font-weight: 300;
      opacity: 0.8;
    }

    .primary-action input.btn.btn-primary,
    input.btn.btn-primary,
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
      transition: border-color 0.5s, color 0.5s;

      &:hover {
        border: none;
        border-bottom: 2px solid ${colors.linkBlue};
      }

      &:focus {
        border: none;
        border-bottom: 2px solid ${colors.linkBlue};
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
        pointer-events: none;
      }

      &:hover select{
        border-bottom: 2px solid ${colors.linkBlue};
      }
    }

    select {
      flex-grow: 1;
      cursor: pointer;

      option {
        outline: none;
      }
    }

    form.form.error {
      .form-group.has-feedback.has-error, 
      .form-group .panel-danger, 
      .input.has-feedback.has-error, 
      .input .panel-danger {
        input.form-control.form-control-danger, 
        input, 
        input:focus {
          border: none;
          border-bottom: 2px solid ${colors.errorRed};
          transition: border-color 0.25s;
        }
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
  section.questionnaire-history-entry,
  footer.questionnaire-status {
    padding: 16px;
  }

  section.questionnaire-step {
    box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey};

    section.value-entry-section {
      width: 100%;
      
      &.ves-inline-field {
        display: flex;
        flex-wrap: wrap;
      }
    } 
    
    span.call-to-action {    
      &.cta-full-width {
        display: block;
        width: 100%;
        
        .form .form-group > * {
          flex: 1;
        }
      }
      
      .form .form-group {
        margin-top: 1em;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
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
    flex-wrap: wrap;

    span.time-left {
      display: flex;

      figure.minutes {
        padding-right: 4px;
        font-weight: 800;
        opacity: 0.5;
      }

      small {
        flex-shrink: 0;
      }

      small.more-specific {
        display: none;
      }
    }

    span.footer-actions {
      display: flex;
      flex-direction: row-reverse;


      button {
        padding: 0px 8px;
        margin-right: 0px;
        font-size: 14px;
        /* line-height: 2em; */
        line-height: 42px;
        letter-spacing: -0.33px;
        border: none;
        transition: color 0.25s, background-color 0.25s;

        &:hover,
        &:active {
          color: ${colors.linkBlueDarker};
          background: none;
          transition: color 0.25s, background-color 0.25s;
        }
        
        &[disabled] {
          color: ${colors.ctaDisabledGrey};        
        }
      }
    }
  }

`;
