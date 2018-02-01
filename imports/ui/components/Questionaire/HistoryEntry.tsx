import styled from 'styled-components';
import * as React from 'react';

import { IStyledComponent } from '../IStyledComponent';
import { colors } from '../../stylesheets/colors';

type Props = {
  question: string,
  value: string | any;
  blockLabel?: string;
  duration?: string;
  component?: React.ComponentClass<{ value: any }> | React.StatelessComponent<any>
  onClick?: () => void
};

const HistoryEntry = class extends React.Component<IStyledComponent & Props> {
  public render() {
    const { component, className, onClick, question, value, blockLabel, duration } = this.props;
    const ValueComponent = component;
    return (
      <section
        className={`questionnaire-history-entry ${className || ''} ${onClick ? 'qhe-has-interaction' : ''}`}
        onClick={onClick}>
        {blockLabel && <section className="block-header">
          <h3>{blockLabel}</h3>
          <span className="time-left">{duration}</span>
        </section>}
        <section className="question-and-answer">
          <h3 className="question">{question}</h3>
          <q className="answer">{(ValueComponent) ? <ValueComponent value={value} /> : String(value)}</q>
        </section>
      </section>
    );
  }
};

export default styled(HistoryEntry) `
  box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey};
  opacity: 0.5;
  transition: opacity 0.25s ease;
  
  .question-and-answer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    
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
      
      &:before {
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
  }
  
  section.block-header {
    display: flex;
    justify-content: space-between;
  
    h3 {
      border:2px solid orange;
      width: unset;
      opacity: 0.75;
      font-size: 14px;
      line-height: 14px;
      font-weight: 400;
      letter-spacing: -0.25px;
      text-transform: uppercase;
    }
    
    span {
      margin: 0;
      white-space: nowrap;
      padding-right: 4px;
      padding-left: 8px;
      font-size: 16px;
    }
  }
  
  &.qhe-has-interaction {
    cursor: pointer;
    position: relative;
    
    &:after {
      transition: color 0.25s ease, opacity 0.25s ease;
      position: absolute;
      right: 8px;
      top: 8px;
      content: 'e';
      font-size: 16px;
      text-align: center;
      -moz-line-height: 0;
      font-family: 'iconfield-v03';
      opacity: 0.5;
    }
    
    
    
    &:hover {
      box-shadow: inset 0 -1px 0 0 ${colors.shadowGrey}, 0 -5px 10px 0 ${colors.shadowGrey};
      opacity: 0.75;
      
      &:after {
        color: ${colors.linkBlue};
        opacity: 1.0;
      }
    }
  }
  
  
`;
