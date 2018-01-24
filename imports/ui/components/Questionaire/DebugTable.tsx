import * as React from 'react';
import styled from 'styled-components';
import {AutoForm, AutoField, ErrorsField, SubmitField} from 'uniforms-bootstrap3';
import {t} from 'c-3po';

import {IStyledComponent} from '../IStyledComponent';

type Props = {
  schema: SimpleSchema,
  fields: Array<string>,
} & IStyledComponent;

type ContentTypes = 'welcome' | 'enterArray' | 'addToArray' | 'chooseFromArray' | 'enterBlock' | 'valueEntry' | 'done';


class DebugTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  retrieveQuestionData(index: number = -1) {
    let field: string | null = this.props.fields[index];

    // determine component to use
    let mainContent: ContentTypes = 'welcome';
    // valid path
    if (index < this.props.fields.length && field) {
      const type = this.props.schema.getQuickTypeForKey(field);
      if (type === 'objectArray') {
        mainContent = 'enterArray';
      } else if (type) {
        mainContent = 'valueEntry';
      } else {
        // schema subfields have an undefined quick type
        const definition = this.props.schema.getDefinition(field, ['uniforms']);
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
    }

    const question = this.determineQuestion(mainContent, field);
    return {
      activeField: field,
      question,
      mainContent,
    };
  };

  determineQuestion(type: ContentTypes, field: string | null): string | string[] {
    if (!field) {
      return '';
    }

    const definition = this.props.schema.getDefinition(field);
    const label = definition.label;
    const accessibility = definition.accessibility;
    const isOptional = definition.optional === true;
    const currentValue = '$VALUE';

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

  public render() {

    const {fields} = this.props;
    return (
      <div className={`questionnaire-area ${this.props.className}`}>
        <div className="questionnaire-column">
          <table>
            <tbody>
            {fields.map((f, i) => {
              const data = this.retrieveQuestionData(i);
              return (<tr key={f}>
                <td><code>{f.replace(/\./g, '.​')}</code></td>
                <td>{data.mainContent}</td>
                <td>{data.question}</td>
              </tr>);
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default styled(DebugTable) `
  table {
    tr {
      td {
        
      }
    }
  }
`;
