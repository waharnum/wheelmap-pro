import styled from 'styled-components';
import * as React from 'react';

import {IStyledComponent} from '../IStyledComponent';

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
        <span className="answer">{
          (ValueComponent) ? <ValueComponent value={this.props.value}/> : String(this.props.value)
        }</span>
      </section>
    );
  }
};

export default styled(HistoryEntry) `
`;
