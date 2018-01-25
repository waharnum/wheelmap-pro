import { gettext, t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Location } from 'history';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { AutoForm, SubmitField } from 'uniforms-bootstrap3';

import Button from '../../components/Button';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IOrganization } from '../../../both/api/organizations/organizations';
import { Events, IEvent } from '../../../both/api/events/events';
import { GuestUserSchema, loginGuestUser, setLoginRedirect } from '../../../both/api/users/accounts';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import SidePanel, { SidePanelTitle } from '../../components/SidePanel';
import { IAsyncDataByIdProps, reactiveSubscriptionByParams } from '../../components/reactiveModelSubscription';

interface IAcceptInviteParams {
  _id: Mongo.ObjectID;
  token: string;
}

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
  user?: Meteor.User;
}

type InternalPageProperties = IAsyncDataByIdProps<IPageModel> &
  IStyledComponent & { params: IAcceptInviteParams, location: Location };

class SignUpForEventPage extends React.Component<InternalPageProperties> {
  public state: {
    busy: boolean;
    error: string | null;
    guestMode: boolean;
  } = {
      busy: false,
      error: null,
      guestMode: true,
    };
  private formRef: AutoForm;

  public componentWillReceiveProps(nextProps: InternalPageProperties) {
    this.modelChanged(nextProps);
  }

  public componentWillMount() {
    this.modelChanged(this.props);
  }


  public render(): JSX.Element | null {
    const user = this.props.model.user;
    const event = this.props.model.event;
    const organization = this.props.model.organization;

    let content: JSX.Element | null = null;
    if (this.state.error) {
      content = (
        <div className="content-area scrollable">
          <h2>
            {t`Something went wrong`}
          </h2>
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
      if (this.state.guestMode) {
        content = (
          <div className="content-area scrollable">
            <h2> {t`Great to have you here!`}</h2>
            <div className="alert alert-info">{t`Please sign up with ${organization.name} to join ${event.name}.`}</div>

            <AutoForm
              placeholder={true}
              showInlineError={true}
              schema={GuestUserSchema}
              ref={this.storeFormReference}
              submitField={() => (<SubmitField value={t`Sign up as a guest`} />)}
              onSubmit={this.onSubmit} />
            <Button to="">{t`Sign-in/Sign-up with email`}</Button>
          </div>
        );
      } else {
        content = (
          <div className="content-area scrollable">
            <h2>{t`Great to have you here!`}</h2>
            <div className="alert alert-info">{t`Please sign up with ${organization.name} to join ${event.name}.`}</div>
            <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />
            <Button to="">{t`Sign-up as a guest`}</Button>
          </div>
        );
      }
    } else {
      content = (
        <div className="content-area scrollable">
          <h2>{t`Welcome to our community!`}</h2>
          <div
            className="alert alert-success">{t`Thanks for signing up with ${organization.name} to join ${event.name}!`}</div>
          <Button className="btn-primary" to={`/events/${event._id}`}>{t`Start mapping now!`}</Button>
        </div>
      );
    }

    return (
      <ScrollableLayout id="PublicSignUpForEventPage" className={this.props.className}>
        <SidePanel
          titleComponent={(
            <SidePanelTitle
              title={event.name}
              description={event.description}
              prefixTitle={organization.name}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}`}
            />
          )}
        />
        {content}
      </ScrollableLayout>
    );
  }

  private onSubmit = (doc) => {
    return new Promise((resolve: (user: Meteor.User) => void, reject: (error: Meteor.Error) => void) => {
      loginGuestUser(doc.username, (error: Meteor.Error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    }).catch((error: Meteor.Error) => {
      this.formRef.setState({ error: new Error(error.reason) });
    });
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private modelChanged = (props: InternalPageProperties) => {
    if (!props.model.user) {
      this.setState({ busy: false, error: null });
      setLoginRedirect(this.props.location.pathname);
    } else {
      setLoginRedirect(null);
      this.acceptInvite();
    }
  }

  private acceptInvite = () => {
    this.setState({ busy: true });
    Meteor.call('eventParticipants.acceptPublicInvitation',
      { eventId: this.props.params._id, invitationToken: this.props.params.token },
      (error, result) => {
        if (error) {
          this.setState({ busy: false, error: t`Accepting invitation failed.` + gettext(error.reason) });
        } else {
          this.setState({ busy: false });
        }
      },
    );
  }
}

const ReactiveSignUpForEventPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(SignUpForEventPage),
  (id, params) => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    const user = Meteor.user();

    return event && organization ? { user, event, organization } : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public', 'users.my.private');

export default styled(ReactiveSignUpForEventPage) `
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
