import styled from 'styled-components';
import * as React from 'react';
import {t, gettext} from 'c-3po';
import {ErrorsField} from 'uniforms-bootstrap3';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationTabs from './OrganizationTabs';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {
  IAsyncDataByIdProps,
  reactiveSubscriptionByParams,
} from '../../components/reactiveModelSubscription';
import {IOrganizationMember} from '../../../both/api/organization-members/organization-members';
import {getLabelForRole} from '../../../both/api/organization-members/roles';
import InviteByEmailForm, {MeteorInsertionCall} from '../../components/InviteByEmailForm';

interface IPageModel {
  organization: IOrganization;
  members: IOrganizationMember[];
};

type ErrorMethod = (error: Error | string | null) => void;

const removeMember = (id: Mongo.ObjectID, errBack: ErrorMethod) => {
  Meteor.call('organizationMembers.remove', id, (error, result) => {
    if (error) {
      // fetch translated error reason, the server is not aware of user language
      errBack(error.isClientSafe ? gettext(error.reason) : t`An unknown error occurred`);
    }
  });
};

const OrganizationMemberEntry = (props: { model: IOrganizationMember, onError: ErrorMethod }) => (
  <li className="member-entry">
    <section className="member-icon" dangerouslySetInnerHTML={{__html: props.model.getIconHTML()}}/>
    <section className="member-name">{props.model.getUserName()}</section>
    <section className="member-role">{getLabelForRole(props.model.role)}</section>
    <section className="member-state">{props.model.invitationState}</section>
    {props.model.invitationState === 'error' ?
      <section className="member-error">{props.model.invitationError}</section> : null}
    <section className="member-remove">
      <button className="btn btn-danger" onClick={() => removeMember(props.model._id || '', props.onError)}>Remove
        Member
      </button>
    </section>
  </li>
);

const ErrorBox = (props: { error: Error | string }) => (
  <div className="error-box alert alert-danger" role="alert">{props.error}</div>
);

class OrganizationMembersPage extends React.Component<IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public state: { error: Error | string | null } = {
    error: null,
  }

  public render(): JSX.Element {
    const organization = this.props.model.organization;
    const members = this.props.model.members;

    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title="Members"/>}
          tabs={<OrganizationTabs id={organization._id || ''}/>}
        />
        <div className="content-area scrollable">
          <div className="participants-box">
            <h2>{t`Invite to Organization`}</h2>
            <InviteByEmailForm onSubmit={this.onInvite}/>
            <h2>{t`Organization Members`}</h2>
            {this.state.error ? <ErrorBox error={this.state.error}/> : null}
            <ol>
              {members.map((m) =>
                (<OrganizationMemberEntry key={String(m._id)} model={m} onError={this.onError}/>))}
            </ol>
          </div>
        </div>
      </ScrollableLayout>
    );
  }

  private onInvite = (invitationEmailAddresses: string[],
                      callback: (error: Meteor.Error | null, result: any) => void) => {
    Meteor.call('organizationMembers.invite', {
      invitationEmailAddresses,
      organizationId: this.props.model.organization._id,
    }, callback);
  };

  private onError = (error: Error | string | null) => {
    this.setState({error});
  };
}

const ReactiveOrganizationMembersPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(OrganizationMembersPage),
  (id): IPageModel | null => {
    const organization = Organizations.findOne(id);
    if (!organization) {
      return null;
    }
    const members = organization.getMembers();
    // pass model with organization & events in one go
    return {organization, members};
  }, 'organizations.by_id.private', 'organizationMembers.by_id.private', 'users.private');

export default styled(ReactiveOrganizationMembersPage) `
`;
