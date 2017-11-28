import {t} from 'c-3po';
import * as React from 'react';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Link} from 'react-router';

import {PlaceInfoSchema} from '@sozialhelden/ac-format';
import {AutoForm, BaseForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';
import SubSchemaChooser from '../../components/SubSchemaChooser';
import {pickFields} from '../../../both/lib/simpl-schema-filter';
import {translateAcFormatToUniforms} from '../../../both/lib/ac-format-uniforms-bridge';

type Props = {} & IStyledComponent;

type State = {
  selectedFields: Array<string>,
};

class MappingTestPage extends React.Component<Props, State> {
  state = {selectedFields: []};

  public render() {
    let schema = PlaceInfoSchema;
    if (this.state.selectedFields && this.state.selectedFields.length > 0) {
      schema = pickFields(schema, this.state.selectedFields);
      translateAcFormatToUniforms(schema);
    }
    return (
      <ScrollableLayout id="ProfilePage" className={this.props.className}>
        <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>}/>
        <div className="content-area scrollable hsplit">
          <div className="content-left">
            <AutoForm
              showInlineError={true}
              schema={PlaceInfoSchema}
              onChange={(field, value) => {
                console.log(value);
                this.setState({selectedFields: value});
              }}>
              <SubSchemaChooser
                name="properties.name"
                schema={PlaceInfoSchema}
                expanded={['properties', 'properties.accessibility']}>
              </SubSchemaChooser>
            </AutoForm>
          </div>
          <div className="content-left">
            <AutoForm
              placeholder={true}
              showInlineError={true}
              schema={schema}>
            </AutoForm>
          </div>
        </div>
      </ScrollableLayout>
    );
  }


};


export default styled(MappingTestPage) `
`;
