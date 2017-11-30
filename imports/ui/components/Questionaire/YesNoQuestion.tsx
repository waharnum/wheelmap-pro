import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import connectField from 'uniforms/connectField';

import {IStyledComponent} from '../IStyledComponent';

type Props = {
  onChange: (value: boolean | null) => void,
  value: boolean;
};

const YesNoQuestion = class extends React.Component<IStyledComponent & Props> {
  public render() {
    return (
      <span className={`call-to-action ${this.props.className}`}>
        <div className='form'>
          <div className='form-group'>
              <button className="btn btn-primary" onClick={() => {
                this.props.onChange(true);
              }}>{t`Yes`}</button>
              <button className="btn btn-primary" onClick={() => {
                this.props.onChange(false);
              }}>{t`No`}</button>
          </div>
        </div>
      </span>
    );
  }
};

const YesNoQuestionField = connectField(YesNoQuestion);

export default styled(YesNoQuestionField) `
  flex-grow: 1;
`;
