import styled from 'styled-components';
import * as Qty from 'js-quantities';
import * as React from 'react';
import connectField from 'uniforms/connectField';

import {determineUnitKind, Quantity} from '@sozialhelden/ac-format';

import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../IStyledComponent';
import {i18nSettings} from '../../../../client/i18n';
import {getPreferredUnitForKind} from '../../../both/i18n/units';


// mostly these come from uniforms
type Props = {
  onChange: (value: string | Quantity | null) => void,
  value: Quantity;
  placeholder?: string;
  field: SchemaDefinition;
  inputRef?: () => void;
};

type State = {
  unitKind: string,
  unit: string, // as preferred by the data entry
  displayUnit: string, // localized
  displayValue: string, // localized
  lastValue: Quantity,
};

const UnitQuantityQuestion = class extends React.Component<IStyledComponent & Props, State> {

  public componentWillMount() {
    this.propsChanged(this.props);
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.propsChanged(nextProps);
  }

  public render() {
    return (
      <span className={`call-to-action ${this.props.className}`}>
        <div className="form">
          <div className="form-group">
            <section className="inputFieldWrapper">
              <input type="number"
                     ref={this.props.inputRef}
                     value={this.state.displayValue}
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
      if (rawValue === undefined || rawValue === '') {
        this.props.onChange(null);
        return;
      }

      const displayString = `${rawValue}${this.state.displayUnit}`;
      // convert from display unit to output unit
      const storeValue = Qty(displayString).to(this.state.unit).scalar;

      this.props.onChange({
        unit: this.state.unit,
        value: storeValue,
        // TODO determine accuracy from user tooling
        accuracy: 5,
        toString: () => {
          return displayString;
        },
      } as Quantity);
    }
  };

  propsChanged(props: Props) {
    let displayValue = '';
    const unitKind = determineUnitKind(props.field.type as SimpleSchema);
    const preferredUnit = props.field.uniforms ? props.field.uniforms.preferredUnit : '';
    const unit = getPreferredUnitForKind(unitKind, preferredUnit);
    const displayUnit = getPreferredUnitForKind(unitKind, preferredUnit, i18nSettings.bestMatchClientLocale);

    let lastValue = props.value;
    if (props.value) {
      // TODO how to handle operator & accuracy here?
      if (typeof props.value === 'string') {
        const parsedQty = Qty(props.value).to(this.state.unit);
        displayValue = String(parsedQty.scalar);
        lastValue = {
          unit: parsedQty.units(),
          value: parsedQty.scalar,
        };
      } else if (props.value.value || props.value.unit) {
        displayValue = String(Qty(props.value.value || 0, props.value.unit).to(displayUnit).scalar);
      }
    }

    this.setState({
      unitKind,
      displayValue,
      lastValue,
      unit,
      displayUnit,
    });
  }
};

const UnitQuantityQuestionField = connectField(UnitQuantityQuestion);

export default styled(UnitQuantityQuestionField) `

`;
