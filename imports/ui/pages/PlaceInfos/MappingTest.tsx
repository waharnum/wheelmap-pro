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


type Props = {} & IStyledComponent;

type State = {
  selectedFields: Array<string>,
};


type FieldTree = { [key: string]: FieldTree };

const isDefinitionSchema = (types: any[]): boolean => {
  // Check whether we need to handle multiple definitions
  if (types && types[0] && types[0].type && types[0].type.pick) {
    return true;
  }

  return false;
};

const filterSchemaWithHierarchy = (schema: SimpleSchema, fieldTree: FieldTree) => {
  const currentLevelKeys = Object.keys(fieldTree);
  const pickKeys: Array<string> = [];
  const extendKeys: { [key: string]: SimpleSchema } = {};
  currentLevelKeys.forEach((key) => {
    const fieldDefinition = schema.getDefinition(key);
    if (Object.keys(fieldTree[key]).length > 0 &&
      isDefinitionSchema(fieldDefinition.type)) {
      extendKeys[key] = fieldDefinition.type[0].type;
    } else {
      pickKeys.push(key);
    }
  });

  Object.keys(extendKeys).forEach((key) => {
    extendKeys[key] = filterSchemaWithHierarchy(extendKeys[key], fieldTree[key]);
  });

  const filteredSchema = schema.pick(...pickKeys);
  filteredSchema.extend(extendKeys);

  return filteredSchema;
};

const pickFields = (schema: SimpleSchema, fields: Array<string>) => {
  const expandedFields: FieldTree = {};

  fields.forEach((key) => {
    const parts = key.split('.');
    let root = expandedFields[parts[0]] = expandedFields[parts[0]] || {};
    for (let i = 1; i < parts.length; i++) {
      root = root[parts[i]] = root[parts[i]] || {};
    }
  });

  return filterSchemaWithHierarchy(schema, expandedFields);
};

class MappingTestPage extends React.Component<Props, State> {
  state = {selectedFields: []};

  public render() {
    let schema = PlaceInfoSchema;
    if (this.state.selectedFields && this.state.selectedFields.length > 0) {
      schema = pickFields(schema, this.state.selectedFields);
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
