import styled from 'styled-components';
import {uniq} from 'lodash';
import {AutoForm, SubmitField} from 'uniforms-bootstrap3';
import * as React from 'react';
import {t, gettext} from 'c-3po';

import {IStyledComponent} from './IStyledComponent';
import {EmailInviteSchema} from '../../both/lib/invite-schema';

export type MeteorInsertionCall = (emailAddresses: string[],
                                   callback: (error: Meteor.Error | null, result: any) => void) => any;

class InviteByEmailForm extends React.Component<{ onSubmit: MeteorInsertionCall } & IStyledComponent> {
  public state = {isSaving: false};
  private formRef: AutoForm;

  public render(): JSX.Element {
    return (<AutoForm
      placeholder={true}
      showInlineError={true}
      disabled={this.state.isSaving}
      schema={EmailInviteSchema}
      submitField={() => (<SubmitField value={t`Send invites`}/>)}
      onSubmit={this.onSubmit}
      ref={this.storeFormReference}
    />);
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private cleanUpEmailAddresses = (invitationEmailAddresses: string[]): string[] => {
    // remove all dupes and null values, trim emails and convert to lower case
    return uniq(invitationEmailAddresses.map((s) => s.toLowerCase().trim())).filter(Boolean);
  }

  private onSubmit = (doc: { invitationEmailAddresses: string[] }) => {
    this.setState({isSaving: true});
    const emails = this.cleanUpEmailAddresses(doc.invitationEmailAddresses);
    return new Promise((resolve, reject) => {
      this.props.onSubmit(emails, (error: any, result: any) => {
        this.setState({isSaving: false});
        if (!error) {
          resolve(true);
        } else {
          // server does not send localized error messages
          reject(new Error(gettext(error.reason)));
        }
      });
    }).then(() => {
      this.formRef.setState({validate: false});
      this.formRef.change('invitationEmailAddresses', ['']);
    }, (error) => {
      this.formRef.setState({error});
    });
  }
}

export default styled(InviteByEmailForm) `
`;
