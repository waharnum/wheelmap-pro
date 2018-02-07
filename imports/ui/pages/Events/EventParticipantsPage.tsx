import styled from 'styled-components';
import * as React from 'react';
import {t} from 'c-3po';
import ClipboardButton from 'react-clipboard.js';
import {colors} from '../../stylesheets/colors';
import {toast} from 'react-toastify';

import EventTabs from './EventTabs';
import {IOrganization} from '../../../both/api/organizations/organizations';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {Hint, HintBox} from '../../components/HintBox';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {IEventParticipant} from '../../../both/api/event-participants/event-participants';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import InviteByEmailForm from '../../components/InviteByEmailForm';
import {getLabelForInvitationState} from '../../../both/api/event-participants/invitationStates';


interface IPageModel {
  event: IEvent;
  participants: IEventParticipant[];
  organization: IOrganization;
}

const removeParticipant = (id: Mongo.ObjectID | undefined) => {
  Meteor.call('eventParticipants.remove', id, (error: Meteor.Error, result) => {
    if (error) {
      toast.error(error.reason);
    }
  });
};

const EventParticipantEntry = (props: { model: IEventParticipant }) => (
  <li className="participant-entry">
    <section className="participant-info">
      <div className="participant-icon" dangerouslySetInnerHTML={{__html: props.model.getIconHTML()}}/>
      <div className="participant-name">{props.model.getUserName()}</div>
    </section>
    <section className="participant-state">
      <div className="participant-user glyphicon">{props.model.userId ? 'p' : ''}</div>
      <div className="participant-state-description">{getLabelForInvitationState(props.model.invitationState)}</div>
      <div className="participant-remove glyphicon">
        <a onClick={() => removeParticipant(props.model._id)}></a>
      </div>
    </section>
    {props.model.invitationState === 'error' ?
      <section className="participant-error">{props.model.invitationError}</section> : null}
  </li>
);

class EventParticipantsPage extends React.Component<IAsyncDataByIdProps<IPageModel> & IStyledComponent> {

  public render(): JSX.Element {
    const event = this.props.model.event;
    const organization = this.props.model.organization;
    const participants = this.props.model.participants;

    const allowPublicInvitation = !!event.invitationToken && event.status !== 'draft';
    const link = Meteor.absoluteUrl(`organizations/${organization._id}/events/${event._id}/public-invitation/${event.invitationToken}`);

    return (
      <ScrollableLayout id="EventParticipantsPage" className={this.props.className}>
        <AdminHeader
          titleComponent={(
            // TODO: Move to shared component
            <HeaderTitle
              title={event.name}
              prefixTitle={organization.name as string}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}/organize`}
            />
          )}
          tabs={<EventTabs id={event._id}/>}
          publicLink={`/organizations/${organization._id}/events/${event._id}`}
        />
        <div className="content-area scrollable hsplit">
          <div className="content-left">
            <h2>{t`Invite single participants to event`}</h2>
            <ol>
              {participants.length === 0 ? <section>{t`No one invited yet.`}</section> : null}
              {participants.map((p) => (<EventParticipantEntry key={String(p._id)} model={p}/>))}
            </ol>
            <InviteByEmailForm onSubmit={this.onInvite}/>
            <h3 className="hint-important">{event.status === 'draft' ?
              t`The event is not published yet. Invitations will be send when published.` :
              t`You made this event public. Invitations will be send immediately.`}
            </h3>
            {this.renderPublicInvitation(link, allowPublicInvitation)}
          </div>
          <div className="content-right">
            <HintBox>
              <Hint className="user">
                {t`Invited people will receive a personal invitation which is only valid for them.`}
              </Hint>
              <Hint className="group">
                {t`Everybody with the share-link below can join.`}
              </Hint>
            </HintBox>
          </div>
        </div>
      </ScrollableLayout>
    );
  }

  private renderPublicInvitation = (link: string, enabled: boolean): JSX.Element => {
    const disabledClass = enabled ? '' : 'disabled';
    return (
      <section className={`share-link ${disabledClass}`}>
        <h2>{t`Share an invitation link`}</h2>
        <div>
          {enabled ?
            t`You can also share the following link to invite people, e.g. via Social Media or handouts.` :
            t`Once the event is not a draft and not set to private, you will be able to share a public invite link here.`
          }
          <form>
            <div className="field form-group copy-to-clipboard">
              <input className={`form-control ${disabledClass}`}
                     type="text" id="public-link" value={link}
                     disabled={true}/>
              <ClipboardButton className={`btn btn-dark ${disabledClass}`}
                               data-clipboard-text={link}
                               button-disabled={!enabled}
                               onSuccess={() => {
                                 toast.success(t`Link copied to clipboard`);
                               }}>
                {t`Copy to clipboard`}
              </ClipboardButton>
            </div>
          </form>
        </div>
      </section>
    );
  };

  private onInvite = (emails: string[],
                      callback: (error: Meteor.Error | null, result: any) => void) => {
    Meteor.call('eventParticipants.invite', {
      invitationEmailAddresses: emails,
      eventId: this.props.model.event._id,
    }, callback);
  };
}

const ReactiveEventParticipantsPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(EventParticipantsPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const participants = event ? event.getParticipants() : [];
    const organization = event ? event.getOrganization() : null;
    return event && organization ? {event, participants, organization} : null;
  },
  'events.by_id.private', 'eventParticipants.by_eventId.private', 'organizations.by_eventId.private', 'users.private');

export default styled(ReactiveEventParticipantsPage) `
  
  .content-left {

    ol {

      li.participant-entry {
        padding: 6px 0;
        border-bottom: 2px solid ${colors.bgGreyDarker};
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        section.participant-info {
          display: flex;
          align-items: center;

          .participant-icon img {
            width: 32px;
            height: 32px;
            margin-left: 2px;
            margin-right: 8px;
            border-radius: 32px;
          }
          
          .participant-name {
            min-width: 24em;
            padding: 0 6px;
            font-size: 16px;
          }
        }

        section.participant-state,
        section.participant-remove.glyphicon {
          text-align: right;
        }

        section.participant-state {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          
          .participant-user.glyphicon,
          .participant-state-description {
            display: inline-block;
            padding: 3px 5px;
            border-radius: 16px;
            line-height: 18px;
            text-align: center;
            color: rgba(0,0,0,0.5);
            background: ${colors.bgGreyDarker};
            border-radius: 16px;
          }

          .participant-user.glyphicon {
            top: 0;
            margin-right: 4px;
            padding: 6px 8px;
          }

          .participant-state-description {
            padding: 6px 8px;
            text-transform: uppercase;
          }

          .participant-state-description {
            text-transform: uppercase;
          }

          .participant-remove.glyphicon {
            padding: 0 8px;
  
            a {
              cursor: pointer;
              font-size: 18px;
              font-family: "iconfield-v03";
              color: ${colors.bgAnthracite};
              opacity: 0.5;
              &:hover {
                color: ${colors.errorRed};
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }

  h3.hint-important {
    color: ${colors.darkGreen};
    font-size: 16px;
    font-weight: 400;
    padding-left: 8px;

    &:before {
      position: relative;
      left: 0;
      top: 1px;
      padding-right: 8px;
      content: '';
      color: ${colors.ctaGreen};
      font-family: 'iconfield-v03';
      font-size: 21px;
    }
  }

  section.share-link {
    margin-top: 40px;

    &.disabled {
      color: ${colors.textMuted}
    }
    
    .copy-to-clipboard {
      display: flex;
      width: 100%;

      input {
        margin: 0;
        &.disabled {
          pointer-events: none;
          color: ${colors.ctaDisabledGrey};
        }
      }

      button {
        margin-left: 8px;
        padding-left: 8px;
        position: relative;
        color: ${colors.linkBlue};
        background-color: white;
                
        &.disabled {
          color: ${colors.ctaDisabledGrey};
        }

        &::before {
          left: 0px;
          top: 0px;
          padding-right: 10px;
          content: '';
          font-family: "iconfield-v03", serif;
        }
      }
    }
  }
}
  

`;
