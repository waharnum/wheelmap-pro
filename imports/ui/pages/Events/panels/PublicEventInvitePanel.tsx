import {gettext, t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import {AutoForm, SubmitField} from 'uniforms-bootstrap3';

import {IOrganization} from '../../../../both/api/organizations/organizations';
import {IEvent} from '../../../../both/api/events/events';
import {GuestUserSchema, loginGuestUser} from '../../../../both/api/users/accounts';
import {IStyledComponent} from '../../../components/IStyledComponent';
import {getDisplayedNameForUser} from '../../../../both/lib/user-name';
import {IEventParticipant} from '../../../../both/api/event-participants/event-participants';


type Props = {
  token: string,
  event: IEvent,
  participant: IEventParticipant | null,
  organization: IOrganization,
  user: Meteor.User | null,
  onJoinedEvent?: () => void,
} & IStyledComponent;

type State = {
  busy: boolean;
  error: string | null;
  guestMode: boolean;
};

class PublicEventInvitePanel extends React.Component<Props, State> {
  public state: State = {
    busy: false,
    error: null,
    guestMode: true,
  };
  private formRef: AutoForm;

  public componentWillReceiveProps(nextProps: Props) {
    this.modelChanged(nextProps);
  }

  public componentWillMount() {
    this.modelChanged(this.props);
  }

  public render(): JSX.Element | null {
    const {user, event, participant, className} = this.props;

    let content: JSX.Element | null = null;
    if (this.state.error) {
      content = (
        <div className={`${className}`}>
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
        <div className={`${className} busy`}>
          <div className="loading-area">{t`Accepting invitation`}</div>
        </div>
      );
    } else if (!user) {
      if (this.state.guestMode) {
        content = (
          <div className={`${className}`}>
            <h2>{t`Great that you are joining ${event.name}.`}</h2>
            <AutoForm
              placeholder={true}
              showInlineError={true}
              schema={GuestUserSchema}
              ref={this.storeFormReference}
              submitField={() => (<SubmitField value={t`Sign up as a guest`}/>)}
              onSubmit={this.onSubmit}/>
            <a onClick={() => this.setState({guestMode: false, error: null})}>{t`Sign-in/Sign-up with email`}</a>
          </div>
        );
      } else {
        content = (
          <div className={`${className}`}>
            <h2>{t`Great that you are joining ${event.name}.`}</h2>
            <Accounts.ui.LoginForm formState={STATES.SIGN_UP} onSignedInHook={this.acceptInvite}/>
            <a onClick={() => this.setState({guestMode: true, error: null})}>{t`Sign-up as a guest`}</a>
          </div>
        );
      }
    } else if (participant && participant.invitationState === 'accepted') {
      content = (
        <div className={`${className}`}>
          <h2>{t`${getDisplayedNameForUser(user)}, you are already a participant of ${event.name}.`}</h2>
          <button className="btn btn-primary" onClick={this.props.onJoinedEvent}>{t`Start mapping`}</button>
        </div>
      );
    } else {
      content = (
        <div className={`${className}`}>
          <h2>{t`${getDisplayedNameForUser(user)}, great that you are joining ${event.name}.`}</h2>
          <button className="btn btn-primary" onClick={this.acceptInvite}>{t`Join event`}</button>
        </div>
      );
    }

    return content;
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
    }).then(this.acceptInvite).catch((error: Meteor.Error) => {
      this.formRef.setState({error: new Error(error.reason)});
    });
  };

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  };

  private modelChanged = (props: Props) => {
    if (!props.user) {
      this.setState({busy: false, error: null});
    }
  };

  private acceptInvite = () => {
    this.setState({busy: true});
    Meteor.call('eventParticipants.acceptPublicInvitation',
      {eventId: this.props.event._id, invitationToken: this.props.token},
      (error, result) => {
        if (error) {
          this.setState({busy: false, error: t`Accepting invitation failed.` + gettext(error.reason)});
        } else {
          this.setState({busy: false});
          if (this.props.onJoinedEvent) {
            this.props.onJoinedEvent();
          }
        }
      },
    );
  };
}

export default styled(PublicEventInvitePanel) `
  padding: 10px;
  
  h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 200;
  }
  
  .loading-area {
    flex-grow: 1;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: rgba(50, 50, 50, 0.5);
  }
`;
