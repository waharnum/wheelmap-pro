import styled from 'styled-components';
import * as React from 'react';
import {t, gettext} from 'c-3po';
import {Meteor} from 'meteor/meteor';
import {Location} from 'history';
import {Accounts, STATES} from 'meteor/std:accounts-ui';

import Button from '../../components/Button';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import SidePanel, {SidePanelTitle} from '../../components/SidePanel';
import {IAsyncDataByIdProps, reactiveSubscriptionByParams} from '../../components/reactiveModelSubscription';
import {IOrganizationMember, OrganizationMembers} from '../../../both/api/organization-members/organization-members';
import {browserHistory} from 'react-router';

interface IAcceptInviteParams {
  _id: Mongo.ObjectID;
  token: string;
}

interface IPageModel {
  organization: IOrganization;
  user?: Meteor.User;
  member?: IOrganizationMember;
}

type InternalPageProperties = IAsyncDataByIdProps<IPageModel> &
  IStyledComponent & { params: IAcceptInviteParams, location: Location };

class SignUpForOrganizationPage extends React.Component<InternalPageProperties> {
  public state: {
    busy: boolean;
    error: string | null;
  } = {
    busy: false,
    error: null,
  };

  public componentWillReceiveProps(nextProps: InternalPageProperties) {
    this.modelChanged(nextProps);
  }

  public componentWillMount() {
    this.modelChanged(this.props);
  }

  public render(): JSX.Element | null {
    const user = this.props.model.user;
    const organization = this.props.model.organization;

    let content: JSX.Element | null = null;
    if (this.state.error) {
      content = (
        <div className="content-area scrollable">
          <h2>{t`Something went wrong`}</h2>
          <div className="alert alert-danger">
            {this.state.error}
          </div>
        </div>
      );
    } else if (this.state.busy) {
      content = (
        <div className="content-area scrollable busy">
          <div className="loading-area">{t`Accepting invitation`}</div>
        </div>
      );
    } else if (!user) {
      content = (
        <div className="content-area scrollable">
          <h2>{t`Great to have you here!`}</h2>
          <div className="alert alert-info">{t`Please sign up to join "${organization.name}".`}</div>
          <Accounts.ui.LoginForm formState={STATES.SIGN_UP}/>
        </div>
      );
    } else {
      content = (
        <div className="content-area scrollable">
          <h2>{t`Welcome to our community!`}</h2>
          <div className="alert alert-success">{t`Thanks for signing up with ${organization.name}!`}</div>
          <Button className="btn-primary"
                  to={`/organizations/${organization._id}/organize`}>{t`Organize events now!`}</Button>
        </div>
      );
    }

    return (
      <ScrollableLayout className={this.props.className}>
        <SidePanel
          titleComponent={(
            <SidePanelTitle
              title={organization.name}
              description={organization.description}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}`}
            />
          )}
        />
        {content}
      </ScrollableLayout>
    );
  }

  private modelChanged = (props: InternalPageProperties) => {
    if (!props.model.member) {
      this.setState({
        error: t`No invitation found. Maybe you already used this token or joined this organization in another way?`,
      });
      return;
    }

    if (!props.model.user) {
      this.setState({busy: false, error: null});
    } else {
      this.setState({busy: false, error: null});

      if (!props.model.member.invitationState ||
        props.model.member.invitationState === 'accepted') {
        // already accepted
        browserHistory.replace(`/organizations/${this.props.model.organization._id}/organize`);
      } else {
        this.acceptInvite();
      }
    }
  };

  private acceptInvite = () => {
    this.setState({busy: true});
    Meteor.call('organizationMembers.acceptInvitation',
      {organizationId: this.props.params._id, invitationToken: this.props.params.token},
      (error: Meteor.Error | null) => {
        if (error) {
          this.setState({
            busy: false,
            error: t`Accepting invitation failed.` + gettext(error.reason || 'Unknown error'),
          });
        } else {
          browserHistory.replace(`/organizations/${this.props.model.organization._id}/organize`);
        }
      },
    );
  };
}

const ReactiveSignUpForOrganizationPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(SignUpForOrganizationPage),
  (id, params) => {
    const organization = Organizations.findOne(id);
    const user = Meteor.user();
    // find either if current user is a member, or there is an invitation with the given token
    const member = organization ? OrganizationMembers.findOne({
      $or: [
        {organizationId: organization._id, invitationToken: params.token},
        {organizationId: organization._id, userId: user ? user._id : -1},
      ],
    }) : null;
    return organization ? {user, organization, member} : null;
  }, 'organizations.by_id.public', 'organizationMembers.by_eventIdAndToken.public', 'users.my.private');

export default styled(ReactiveSignUpForOrganizationPage) `
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;

  .content-area.busy {
    flex-grow: 1;
    display: flex;

    .loading-area {
      flex-grow: 1;
      align-items: center;
      display: flex;
      justify-content: center;
      background-color: rgba(50, 50, 50, 0.5);
    }
  }
`;
