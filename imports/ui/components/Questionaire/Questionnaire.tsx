import {t} from 'c-3po';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import * as React from 'react';
import {AutoForm, AutoField, ErrorsField, SubmitField} from 'uniforms-bootstrap3';
import {extend, get, pick, set, concat, sample, isEqual} from 'lodash';


import AccessibilityDetails from 'wheelmap-react/lib/components/NodeToolbar/AccessibilityDetails';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../IStyledComponent';
import {pickFieldForAutoForm} from '../../../both/lib/simpl-schema-filter';
import HistoryEntry from './HistoryEntry';
import {forEachKeyInSchemas, isEqualSchema} from '../../../both/lib/ac-format-uniforms-bridge';
import {determineDuration, newBlockSwitchOverhead} from '../../../both/lib/estimate-schema-duration';
import {stringifyDuration} from '../../../both/i18n/duration';

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
  onExitSurvey?: (model: any) => void,
  onSubmit?: (model: any, field: string | null) => Promise<Mongo.ObjectID>,
} & IStyledComponent;

type ContentTypes =
  'welcome'
  | 'enterArray'
  | 'addToArray'
  | 'chooseFromArray'
  | 'abort'
  | 'enterBlock'
  | 'valueEntry'
  | 'done';
type NextFieldMode = 'nextIndex' | 'exitBlock' | 'skipBlock' | 'stop' | 'abort' | 'history';

type State = {
  history: Array<HistoryDataEntry>,
  remainingDuration: number,
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
 * // used by lodash
 * simpleSchemaPathToObjectPath( 'a.$.b.$.c.e.f', [4, 2] ) returns 'a[4].b[2].c.e.f'.
 *
 * // used by uniforms
 * simpleSchemaPathToObjectPath( 'a.$.b.$.c.e.f', [4, 2], 0, {wrapInArray: false} ) returns 'a4.b2.c.e.f'.
 */
const simpleSchemaPathToObjectPath = (simpleSchemaPath: string,
                                      arrayIndexes: Array<number> = [],
                                      options: { wrapInArray?: boolean, defaultValue?: number } = {
                                        wrapInArray: true,
                                        defaultValue: 0,
                                      }): string => {
  if (!simpleSchemaPath) {
    return '';
  }

  options = options || {};

  let result = '';
  let index = 0;
  for (const path of simpleSchemaPath.split('.')) {
    if (path === '$') {
      if (options.wrapInArray) {
        result += `[${arrayIndexes[index] || options.defaultValue || 0}]`;
      } else {
        result += `.${arrayIndexes[index] || options.defaultValue || 0}`;
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
    remainingDuration: 0,
    currentIndex: -1,
    question: '',
    activeField: null,
    arrayIndexes: [],
    mainContent: 'welcome',
    model: {},
  };

  private durationCache: { [key: string]: number } = {};
  private hasFocus: boolean = false;

  constructor(props: Props) {
    super(props);

    (window as any).__schema = props.schema;
    this.state.model = props.model || {};

    // TODO move to shared code
    this.durationCache = {};
    forEachKeyInSchemas(props.schema, (schema, path, pathFromRoot, hasChildren) => {
      this.durationCache[pathFromRoot] = hasChildren ? newBlockSwitchOverhead : determineDuration(schema, path);
    });
    this.state.remainingDuration = props.fields.reduce((p, v) => p + (this.durationCache[v] || 0), newBlockSwitchOverhead);
  }

  public componentWillReceiveProps(nextProps: Props) {
    // reset ui when questionnaire changed
    if (!isEqual(this.props.fields, nextProps.fields) || !isEqualSchema(this.props.schema, nextProps.schema)) {
      (window as any).__schema = nextProps.schema;
      // console.log(nextProps.fields);

      this.durationCache = {};
      forEachKeyInSchemas(nextProps.schema, (schema, path, pathFromRoot, hasChildren) => {
        this.durationCache[pathFromRoot] = hasChildren ? newBlockSwitchOverhead : determineDuration(schema, path);
      });

      const remainingDuration = nextProps.fields.reduce((p, v) => p + (this.durationCache[v] || 0), newBlockSwitchOverhead);
      this.setState({
        history: [],
        progress: 0,
        remainingDuration,
        currentIndex: -1,
        activeField: null,
        mainContent: 'welcome',
        arrayIndexes: [],
        model: nextProps.model || {},
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
      case 'abort':
        this.setState(extend(nextState, {
          currentIndex: this.props.fields.length,
          progress: 1,
          activeField: null,
          remainingDuration: 0,
          mainContent: 'abort',
          arrayIndexes: [],
        }), this.scrollRefIntoView);
        return;
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

      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.model, null)
          .then((result) => {
            console.log('SAVED', result);
            // store id for next update
            this.state.model._id = result;
          }).catch((error) => {
          console.error(error);
          toast.error(error);
        });
      }
    }

    const question = this.determineQuestion(mainContent, nextActiveField);
    const remainingDuration = this.props.fields.slice(Math.max(nextIndex, 0)).reduce((p, v) => p + (this.durationCache[v] || 0), 0);
    this.hasFocus = false;

    this.setState(extend(nextState, {
      currentIndex: nextIndex,
      progress: nextIndex / this.props.fields.length,
      activeField: nextActiveField,
      remainingDuration,
      question,
      mainContent,
      arrayIndexes,
    }), this.scrollRefIntoView);
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

  determineHeaders(): { title: string, path?: string } {
    let path = undefined;

    const isExistingPlace = this.state.model && this.state.model._id;
    const title = isExistingPlace ? t`Edit` : t`Add`;

    if (this.state.activeField) {
      const parentPath = this.state.activeField.split('.').slice(0, -1).join('.');
      if (parentPath && parentPath.length > 0) {
        path = this.props.schema.get(parentPath, 'label');
      }
    }

    return {title, path};
  }

  historySection() {
    let index = 0;
    return this.state.history.map(entry => {
      index++;
      let callback: (() => void) | undefined = undefined;
      if (entry.goTo) {
        callback = this.goToNextField.bind(this, 'history', {
          // TODO this duplicates quite a lot of data, move the slicing into a method
          history: this.state.history.slice(0, index - 1),
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
    let bareValue = resultValue;
    if (typeof resultValue === 'object') {
      const {toString, ...stripped} = resultValue;
      bareValue = stripped;
    }
    set(this.state.model, objectPath, bareValue);
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

  scrollRefIntoView = () => {
    if (this.refs['latest-active-block'] && !this.hasFocus) {
      (this.refs['latest-active-block'] as HTMLElement).scrollIntoView({block: 'end', behavior: 'smooth'});
    }
  };

  valueEntrySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
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
      <section className={`questionnaire-step ${isOptional ? 'questionnaire-optional' : 'questionnaire-mandatory'}`}
               ref="latest-active-block">
        <AutoForm
          action="#"
          key={field}
          placeholder={true}
          onSubmit={this.submitValue.bind(this, field, this.state.question)}
          schema={subSchema}
          model={subModel}>
          <h3 className="question">{this.state.question}</h3>
          <section className={isSelfSubmitting ? 'value-entry-section ves-inline-field' : 'value-entry-section'}>
            <AutoField
              inputRef={ref => {
                if (ref) {
                  ref.focus();
                  this.hasFocus = true;
                } else {
                  this.hasFocus = false;
                }
              }}
              label={false}
              name={simpleSchemaPathToObjectPath(field, this.state.arrayIndexes, {wrapInArray: false})}>
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
        className: 'enter-block-history',
      }),
      model: this.state.model,
    };

    this.goToNextField('nextIndex', nextState);
  };

  enterBlockSection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const isOptional = definition.optional === true;

    return (
      <section className="questionnaire-step enter-block"
               ref="latest-active-block">
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
        className: 'enter-array-history',
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
        className: 'skip-block',
      }),
      model: this.state.model,
    };
    this.goToNextField('skipBlock', nextState);
  };

  enterArraySection(field: string) {
    const definition = this.props.schema.getDefinition(field);
    const isOptional = definition.optional === true;

    const currentValue = get(this.state.model, simpleSchemaPathToObjectPath(field), []);
    const arrayIndex = currentValue.length;

    return (
      <section className="questionnaire-step enter-array"
               ref="latest-active-block">
        <h3 className="question">{this.state.question}</h3>
        <span className="call-to-action">
          <div className="form">
            <div className="form-group">
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
      <section className="questionnaire-step welcome"
               ref="latest-active-block">
        <h3 className="question">{t`Welcome text goes here.`}</h3>
        <span className="call-to-action">
          <div className="form">
            <div className="form-group">
              <button className="primary" onClick={this.startQuestionnaire}>{t`Okay`}</button>
            </div>
          </div>
        </span>
      </section>
    );
  }

  doneSection() {
    const details = get(this.state.model, 'properties.accessibility') || {};
    return (
      <section className="questionnaire-step done"
               ref="latest-active-block">
        <h3 className="question">{t`Well done, you made it through!`}</h3>
        <section className="survey-results">
          {/*<code>{JSON.stringify(this.state.model, null, 2)}</code>*/}
          <AccessibilityDetails details={details}/>
        </section>
        <span className="call-to-action">
          <div className="form">
            <div className="form-group">
              <button onClick={this.props.onExitSurvey} className="primary">{t`Back to map`}</button>
            </div>
          </div>
        </span>
      </section>
    );
  }

  abortSection() {
    return (
      <section className="questionnaire-step done"
               ref="latest-active-block">
        <h3 className="question">{t`Discard changes?`}</h3>
        <span className="call-to-action">
          {t`We will discard your changes, do you really want to abort?`}
          <div className="form">
            <div className="form-group">
              <button onClick={this.props.onExitSurvey} className="primary btn-danger">{t`Back to map`}</button>
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

    // when skipping out of an object, check if this would leave the object unusable
    if (this.state.activeField) {
      const parentIndex = this.state.activeField.lastIndexOf('.');
      const parentFieldPath = this.state.activeField.substr(0, parentIndex);

      const subSchema = pickFieldForAutoForm(this.props.schema, parentFieldPath);

      const objectPath = simpleSchemaPathToObjectPath(parentFieldPath, this.state.arrayIndexes);
      const subModel = set({}, objectPath, pick(this.state.model, objectPath));

      const validator = subSchema.newContext();
      const okay = validator.validate(subModel);
      // object is invalid, warn the user about it
      if (!okay) {
        this.goToNextField('abort', nextState);
        return;
      }
    }

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

    // when aborting editing, validate
    const validator = this.props.schema.newContext();
    const okay = validator.validate(this.state.model);
    if (!okay) {
      this.goToNextField('abort', nextState);
    } else {
      this.goToNextField('stop', nextState);
    }
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
      case 'abort':
        displayField = this.abortSection();
        break;
    }

    // console.log('state:', this.state);

    const headers = this.determineHeaders();
    const canSkip = !['welcome'].includes(this.state.mainContent);
    const pathName = headers.path || t`block`;

    return (
      <div className={`questionnaire-area ${this.props.className}`}>
        <header className="questionnaire-progress">
          <span className="progress-information">
            <h1 className={`place-name ${headers.path ? '' : 'no-block'}`}>{headers.title}</h1>
            {headers.path ? <h2>{headers.path}</h2> : null}
            <span className="header-actions">
              {canSkip ?
                <button className="btn btn-sm dropdown-toggle" type="button"
                        id={`tiredDropdown`}
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{t`I'm tired`}
                </button> :
                <button className="btn" type="button" onClick={this.props.onExitSurvey}>{t`Cancel`}</button>
              }
              <div className="dropdown-menu" aria-labelledby={`tiredDropdown`}>
                <h3>{t`Tired? What do you want to do now?`}</h3>
                <span className="dropdown-actions">
                  <button className="complete-block"
                          disabled={this.state.activeField ? this.state.activeField.lastIndexOf('.') <= 0 : true}
                          onClick={this.exitBlock}>{t`Complete ${pathName}`}</button>
                  <button className="stop-survey"
                          disabled={this.state.currentIndex >= this.props.fields.length}
                          onClick={this.stopSurvey}>{t`Stop here`}</button>
                  <button className="secondary">{t`I'm fine`}</button>
                </span>
              </div>
            </span>
          </span>
          <div className="progress-section">
            <figure className="progress-done">{Math.floor(this.state.progress * 100)}</figure>
            <div className="progress-bar">
              <div className="progress-done" style={{width: `${this.state.progress * 100}%`}}/>
            </div>
            <span className="time-left">
              {stringifyDuration(this.state.remainingDuration)}
              {' ' + t`left`}
            </span>
          </div>
        </header>
        <div className="history-column">
          {this.historySection()}
        </div>
        <div className="questionnaire-column">
          {displayField}
        </div>
      </div>
    );
  }
}

export default styled(Questionnaire) `

  background-color: ${colors.bgGrey};

  &.questionnaire-area {
    color: ${colors.bgAnthracite};
    width:100%;

    h1 {
      font-size: 18px;
      letter-spacing: -0.32px;
    }
    
    h2 {    
      margin: 0 0 0 10px;
      font-size: 18px;
      line-height: 24px;
      position: relative;
      
      &::before {
        position: absolute;
        content: " ";
        left: -8px;
        top: 4px;
        width: 6px;
        height: 16px;
        background-image: url(/images/chevron-big-right-dark@2x.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    h3 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.51px;
      line-height: 29px;
    }

    section.questionnaire-step.welcome h3,
    section.questionnaire-history-entry.welcome h3  {
      font-weight: 300;
      opacity: 0.8;
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

    form .field.form-group {
      .checkbox {
        border-radius: 32px;

        label {
          input {
              width: 8px;
              height: 8px;
          }
        }
      }
    }

    .primary-action input.btn.btn-primary,
    input.btn.btn-primary,
    button,
    .checkbox,
    .checkbox label {
      font-size: 21px;
      font-weight: 400;
      color: ${colors.linkBlue};
      transition: color 0.25s, background-color 0.25s;
      
      &:hover,
      &:active {
        color: white;
        background: ${colors.linkBlue};
        transition: color 0.25s, background-color 0.25s;
      }
    }
    
    
    .primary-action input.btn.btn-primary,
    input.btn.btn-primary,
    button,
    .checkbox {
      flex-grow: 1;
      padding: 0 10px;
      margin-right: 4px;
      line-height: 2em;
      background: none;
      border: 1px solid ${colors.linkBlue};
    }
    
    .primary-action input.btn.btn-primary,
    input.btn.btn-primary,
    button {
      text-transform: uppercase;
      border-radius: 4px;
    }

    button.secondary {
      /* color: #8B8B8C; */
      flex-grow: 0;
      color: ${colors.bgAnthracite};
      opacity: 0.4;
      border: none;
      transition: color 0.25s, background-color 0.25s, opacity 0.25s;

      &:hover,
      &:active,
      &:hover label,
      &:active label {
        opacity: 1;
        color: white;
        background: ${colors.bgAnthracite};
        transition: color 0.25s, background-color 0.25s, opacity 0.25s;
      }
    }

    input,
    span.selectWrapper select {
      padding: 0 8px;
      font-size: 21px;
      font-weight: 400;
      text-overflow: ellipsis;
      -webkit-appearance: none; /* default arrows get hidden */
      -moz-appearance: none; /* default arrows get hidden */
      background-color: ${colors.bgWhiteDarker};
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
        background: none;
        opacity: 0.5;
      }
    }
    
    button {
      &:disabled {
        opacity: 0.5;
      }
    }

    input {
      line-height: 1.25em;
    }

    input::placeholder
    {
      font-weight: 300;
    }
    ::-webkit-input-placeholder /* Chrome/Opera/Safari */
    {
      font-weight: 300;
    }
    ::-moz-placeholder /* Firefox 19+ */
    {
      font-weight: 300;
    }
    :-ms-input-placeholder /* Internet Explorer 10-11 */
    {
      font-weight: 300;
    }

    input::-ms-clear {
      display: none;
    }
    
    section.inputFieldWrapper {
      flex: 1;
      display: flex;
      border-bottom: 2px solid ${colors.shadowGrey};
      
      input {
        border: none;
        flex-shrink: 1;
        width: 50%;
        box-sizing: border-box;
      }
      
      span {
        flex-grow: 1;
        font-size: 21px;
        font-weight: 400;
        vertical-align: baseline;
        line-height: 1.25em;
        padding-top: 12px;
        color: ${colors.linkBlue};
      }
      
      // not supported for IE or edge
      &:focus-within {
        border-bottom: 2px solid ${colors.linkBlue};
      }
    }

    section.questionnaire-step {
      
      span.selectWrapper,
      span.selectWrapper select.form-control {
        line-height: 52px;
      }

      span.selectWrapper {
        flex-grow: 1;
        position: relative;
        display: flex;
        padding-top: 16px;
        height: 60px;

        &:after {
          content: " ß";
          position: absolute;
          top: 0.8em;
          right: 8px;
          font-size: 18px;
          text-align: center;
          -moz-line-height: 0;
          color: ${colors.linkBlue};
          font-family: 'iconfield-V03';
          pointer-events: none;
        }

        &:hover select{
          border-bottom: 2px solid ${colors.linkBlue};
        }
        
        select.form-control {
          flex-grow: 1;
          cursor: pointer;
          height: 52px;
          
          option {
            outline: none;
          }
        }
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

      .call-to-action.cta-full-width .form {
        
        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .primary-action.has-danger {
            width: 100%;
          }

          .panel.panel-danger {
            order: -1;
            margin-bottom: 10px;

            .panel-body {
              margin-top: 0 !important;
            }
          }
        }
      }
    }
  }

  header.questionnaire-progress {
    padding: 4px 16px;
    display: flex;
    flex-direction: column;
    box-shadow:0 0 3px ${colors.boxShadow};

    span.progress-information {
      flex:1;
      font-size: 18px;
      font-weight: 800;
      line-height: 24px;
      display: flex;

      
      h1.place-name {
        font-weight: 800;
        line-height: 24px;
        margin: 0;
      }
      
      h1.no-block {      
        flex: 1;
      }
      
      h2 {      
        flex: 1;
      }
    }
    
    .progress-section {
      flex:1;
      padding-top:5px;
      display:flex;
      flex-direction:row;
      align-items: center;
      
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
      .progress-bar {
        height: 3px;
        width: 100%;
        background-color: ${colors.shadowGrey};
        box-shadow: none;
        flex:1;
  
        .progress-done {
          content: ' ';
          height: 4px;
          font-size: 2px;
          background-color: ${colors.linkBlue};
          min-width:2px;
        }
      }

      span.time-left {
        color: ${colors.textMuted};  
        padding-right: 4px;
        white-space: nowrap;
        padding-left: 8px;
      }
    }

    span.header-actions {
      display: flex;
      position: relative;

      &> button {
        padding: 0px 8px;
        margin-right: 0px;
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
        
        &[disabled] {
          color: ${colors.ctaDisabledGrey};        
        }
      }
      
      .dropdown-menu {
        position: fixed;
        top: 0;
        width: 100%;
        border: none;
        flex-direction: column;
        align-items: left;
        padding: 16px;
        margin: 0;
        border-radius: 0;
        
        span.dropdown-actions {
          margin-top: 24px;
        }
      }
    
      &.open > .dropdown-menu {
        display: flex;
      }
      
    }
  }

  section.questionnaire-step,
  section.questionnaire-history-entry {
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
        .form .form-group > button.secondary {
          flex-grow:0;
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

  section.questionnaire-step.enter-block,
  section.questionnaire-step.enter-array,
  section.questionnaire-history-entry.enter-block-history,
  section.questionnaire-history-entry.enter-array-history {

    h3 {
      opacity: 0.75;
      font-size: 14px;
      line-height: 14px;
      font-weight: 400;
      letter-spacing: -0.25px;
      text-transform: uppercase;
    }
  } 

  section.questionnaire-history-entry {
    background-color: ${colors.bgGreyLighter};

    h3 {
      font-size: 21px;
      line-height: 29px;
      font-weight: 800;
      opacity: 0.75;
    }

    q {
      font-weight: 400;
    }
  }

  section.questionnaire-step.next-block {
    display: none;
  }

  form .form-group span.help-block {
    line-height: 18px;
  }
`;
