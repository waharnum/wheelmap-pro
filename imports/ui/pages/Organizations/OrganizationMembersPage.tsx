import styled from 'styled-components';
import * as React from 'react';
import {t, gettext} from 'c-3po';
import {ErrorsField} from 'uniforms-bootstrap3';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {
  IAsyncDataByIdProps,
  reactiveSubscriptionByParams,
} from '../../components/reactiveModelSubscription';
import {IOrganizationMember, OrganizationMembers} from '../../../both/api/organization-members/organization-members';
import {roles, getLabelForRole, RoleType} from '../../../both/api/organization-members/roles';
import InviteByEmailForm from '../../components/InviteByEmailForm';
import OrganizationAdminHeader from './OrganizationAdminHeader';
import {getLabelForInvitationState} from '../../../both/api/organization-members/invitationStates';

interface IPageModel {
  organization: IOrganization;
  members: IOrganizationMember[];
};

type CallbackFunction = (error: string | null, result: any) => void;

const changeMemberRole = (memberId: Mongo.ObjectID, role: RoleType, callback: CallbackFunction) => {
  Meteor.call('organizationMembers.changeRole', {_id: memberId, role}, (error: Meteor.Error, result: any) => {
    // fetch translated error reason, the server is not aware of user language
    if (error) {
      callback(error.isClientSafe ? gettext(error.reason) : t`An unknown error occurred`, result);
    } else {
      callback(null, result);
    }
  });
};

const OrganizationMemberRoleDropDown = (props: { model: IOrganizationMember, onError: CallbackFunction }) => (
  <section className="member-role dropdown">
    <button className="btn btn-default btn-sm dropdown-toggle" type="button"
            id={`roleDropdownMenuButtonFor${props.model._id}`}
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {getLabelForRole(props.model.role)}
      <span className="caret"/>
    </button>
    <div className="dropdown-menu" aria-labelledby={`roleDropdownMenuButtonFor${props.model._id}`}>
      {roles.map((r) =>
        (<li key={r.value}><a className="dropdown-item" onClick={() => {
          changeMemberRole(props.model._id || '', r.value, props.onError);
        }}>{getLabelForRole(r.value)}</a></li>))}
    </div>
  </section>
);

const removeMember = (id: Mongo.ObjectID, callback: CallbackFunction) => {
  Meteor.call('organizationMembers.remove', id, (error: Meteor.Error, result) => {
    if (error) {
      // fetch translated error reason, the server is not aware of user language
      callback(error.isClientSafe ? gettext(error.reason) : t`An unknown error occurred`, null);
    } else {
      callback(null, result);
    }
  });
};

const OrganizationMemberEntry = (props: { model: IOrganizationMember, onError: CallbackFunction }) => (
  <li className="member-entry">
    <section className="member-icon" dangerouslySetInnerHTML={{__html: props.model.getIconHTML()}}/>
    <section className="member-name">{props.model.getUserName()}</section>
    {props.model.editableBy(Meteor.userId()) ?
      (<section>
        {props.model.invitationState === 'error' ?
          <section className="member-error">{props.model.invitationError}</section> : null}
        <OrganizationMemberRoleDropDown model={props.model} onError={props.onError}/>
        <section className="member-state">{getLabelForInvitationState(props.model.invitationState)}</section>
        <section className="member-remove">
          <button className="btn btn-danger" onClick={() => removeMember(props.model._id || '', props.onError)}>
            {t`Remove Member`}
          </button>
        </section>
      </section>) :
      (<section className="member-role">{getLabelForRole(props.model.role)}</section>)
    }
  </li>
);

const ErrorBox = (props: { error: string }) => (
  <div className="error-box alert alert-danger" role="alert">{props.error}</div>
);

class OrganizationMembersPage extends React.Component<IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public state: { error: string | null } = {
    error: null,
  }

  public render(): JSX.Element {
    const organization = this.props.model.organization;
    const members = this.props.model.members;

    return (
      <ScrollableLayout className={this.props.className}>
        <OrganizationAdminHeader organization={organization}/>
        <div className="content-area scrollable">
          {this.state.error ? <ErrorBox error={this.state.error}/> : null}
          <h2>{t`Invite to Organization`}</h2>
          <InviteByEmailForm onSubmit={this.onInvite}/>
          <h2>{t`Organization Members`}</h2>
          <ol>
            {members.map((m) =>
              (<OrganizationMemberEntry key={String(m._id)} model={m} onError={this.onError}/>))}
          </ol>
        </div>
      </ScrollableLayout>
    );
  }

  private onInvite = (invitationEmailAddresses: string[],
                      callback: (error: Meteor.Error | null, result: any) => void) => {
    this.setState({error: null});
    Meteor.call('organizationMembers.invite', {
      invitationEmailAddresses,
      organizationId: this.props.model.organization._id,
    }, callback);
  };

  private onError = (error: string | null) => {
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
