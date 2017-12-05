import styled from 'styled-components';
import * as React from 'react';

import {IStyledComponent} from '../IStyledComponent';
import {colors} from '../../stylesheets/colors';

type Props = {
  question: string,
  value: string | any;
  component?: React.ComponentClass<{ value: any }> | React.StatelessComponent<any>
  onClick?: () => void
};

const HistoryEntry = class extends React.Component<IStyledComponent & Props> {
  public render() {
    const ValueComponent = this.props.component;
    return (
      <section
        className={`questionnaire-history-entry ${this.props.className || ''} ${this.props.onClick ? 'qhe-has-interaction' : ''}`}
        onClick={this.props.onClick}>
        <h3 className="question">{this.props.question}</h3>
        <q className="answer">{
          (ValueComponent) ? <ValueComponent value={this.props.value}/> : String(this.props.value)
        }</q>
      </section>
    );
  }
};

export default styled(HistoryEntry) `
  box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey};
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  opacity: 0.5;
  transition: opacity 0.25s ease;
  
  h3.question,
  q.answer {
    font-size: 20px;
    line-height: 1.25em;
  }
  
  q.answer {
    quotes: '"' '"' "'" "'";
    margin-top: 8px;
    font-weight: 300;
    position: relative;
    &::before {
      content: open-quote;
    }
    &:after {
      content: close-quote;
    }
  }

  h3.question {
    width: 100%;
    font-weight: 800;
  }
  
  &.qhe-has-interaction {
    cursor: pointer;
    
    q.answer:after {
      transition: color 0.25s ease, opacity 0.25s ease;
      position: relative;
      right: 0;
      padding-left: 8px;
      top: -0.1em;
      content: 'e';
      font-size: 16px;
      text-align: center;
      -moz-line-height: 0;
      font-family: 'iconfield-V03';
      opacity: 0.5;
    }
    
    &:hover {
      opacity: 0.75;
      box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey}, 0 -5px 10px 0 ${colors.shadowGrey};
      
      q.answer:after {
        color: ${colors.linkBlue};
        opacity: 1.0;
      }
    }
  }
`;
