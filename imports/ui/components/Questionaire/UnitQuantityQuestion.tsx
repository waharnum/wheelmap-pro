import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import connectField from 'uniforms/connectField';

import {IStyledComponent} from '../IStyledComponent';
import {determineUnitKind, Quantity} from '@sozialhelden/ac-format';
import {colors} from '../../stylesheets/colors';
import {getPreferredUnitForKind} from '../../../both/i18n/units';

type Props = {
  onChange: (value: string | Quantity | null) => void,
  value: Quantity;
  placeholder?: string;
  field: SchemaDefinition
};

type State = {
  unitKind: string,
  unit: string, // as preferred by the data entry
  displayUnit: string, // localized
};

const UnitQuantityQuestion = class extends React.Component<IStyledComponent & Props, State> {

  public componentWillMount() {
    this.propsChanged(this.props);
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.propsChanged(nextProps);
  }

  public render() {
    console.log(this.props);

    // TODO how to handle operators here?
    const inputValue = (!this.props.value || typeof this.props.value === 'string') ?
      this.props.value :
      this.props.value.value;

    return (
      <span className={`call-to-action ${this.props.className}`}>
        <div className="form">
          <div className="form-group">
            <section className="inputFieldWrapper">
              <input type="text"
                     value={inputValue || ''}
                     className="form-control"
                     placeholder={this.props.placeholder}
                     onChange={this.textChanged}/>
              <span>{this.state.displayUnit}</span>
            </section>
          </div>
        </div>
      </span>
    );
  }

  textChanged = (event) => {
    const rawValue = event.target.value;

    if (this.props.onChange) {
      // TODO convert from display unit to output unit
      const asString = `${rawValue}${this.state.displayUnit}`;

      this.props.onChange({
        unit: this.state.unit,
        value: rawValue,
        // TODO determine accuracy from user tooling
        accuracy: 5,
        toString: () => {
          return asString;
        },
      } as Quantity);
    }
  };

  propsChanged(props: Props) {
    const unitKind = determineUnitKind(props.field.type as SimpleSchema);
    const preferredUnit = props.field.uniforms ? props.field.uniforms.preferredUnit : '';
    this.setState({
      unitKind,
      unit: getPreferredUnitForKind(unitKind, preferredUnit),
      displayUnit: getPreferredUnitForKind(unitKind, preferredUnit, 'de_DE'),
    });
  }
};

const UnitQuantityQuestionField = connectField(UnitQuantityQuestion);

export default styled(UnitQuantityQuestionField) `

`;
