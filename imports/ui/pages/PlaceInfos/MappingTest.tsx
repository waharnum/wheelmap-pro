import {t} from 'c-3po';
import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Link} from 'react-router';

import {PlaceInfoSchema} from '@sozialhelden/ac-format';
import {AutoForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';
import SubSchemaChooser from '../../components/SubSchemaChooser';


const MappingTestPage = (props: IStyledComponent & { user: Meteor.User, ready: boolean }) => {
  return (
    <ScrollableLayout id="ProfilePage" className={props.className}>
      <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>}/>
      <div className="content-area scrollable">
        <AutoForm
          placeholder={true}
          showInlineError={true}
          schema={PlaceInfoSchema}>
          <SubSchemaChooser value={5} name="properties.name" schema={PlaceInfoSchema} expanded={['properties']}>
          </SubSchemaChooser>
        </AutoForm>
      </div>
    </ScrollableLayout>
  );
};


export default styled(MappingTestPage) `
`;
