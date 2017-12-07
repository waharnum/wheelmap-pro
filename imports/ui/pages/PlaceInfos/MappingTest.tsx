import {t} from 'c-3po';
import * as React from 'react';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Link} from 'react-router';
import SimpleSchema from 'simpl-schema';

import {PlaceInfoSchema} from '@sozialhelden/ac-format';
import {AutoForm, BaseForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';
import SubSchemaChooser from '../../components/SubSchemaChooser';
import {pickFields} from '../../../both/lib/simpl-schema-filter';
import {translateAcFormatToUniforms} from '../../../both/lib/ac-format-uniforms-bridge';
import Questionnaire from '../../components/Questionaire/Questionnaire';

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
              model={{
                fields: [
                  'properties',
                  'properties.name',
                  'properties.category',
                  'properties.accessibility',
                  'properties.accessibility.entrances',
                  'properties.accessibility.entrances.$.ratingForWheelchair',
                  'properties.accessibility.entrances.$.door',
                  'properties.accessibility.entrances.$.door.width'],
              }}
              schema={new SimpleSchema({
                fields: Array,
                'fields.$': String,
              })}
              onChange={(field, value) => {
                this.setState({selectedFields: value});
              }}>
              <SubSchemaChooser
                name="fields"
                schema={PlaceInfoSchema}
                expanded={['properties', 'properties.accessibility']}>
              </SubSchemaChooser>
            </AutoForm>
          </div>
          <div className="content-left">
            <Questionnaire
              schema={schema}
              fields={this.state.selectedFields}
            />
            {/*<AutoForm*/}
            {/*placeholder={true}*/}
            {/*showInlineError={true}*/}
            {/*schema={schema}>*/}
            {/*</AutoForm>*/}
          </div>
        </div>
      </ScrollableLayout>
    );
  }
};

export default styled(MappingTestPage) `
.content-left {
  max-width: 375px;
}
`;
