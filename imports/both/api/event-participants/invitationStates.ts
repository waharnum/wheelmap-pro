import {t, gettext} from 'c-3po';

export type InvitationStateType = 'draft' | 'queuedForSending' | 'sent' | 'accepted' | 'error' | 'old-guest';

export const invitationStates = Object.freeze([
  {label: t`Draft`, value: 'draft'},
  {label: t`Queued for sending`, value: 'queuedForSending'},
  {label: t`Sent`, value: 'sent'},
  {label: t`Accepted`, value: 'accepted'},
  {label: t`Error Occurred`, value: 'error'},
  {label: t`Old guest`, value: 'old-guest'},
]) as ReadonlyArray<{ label: string, value: InvitationStateType }>;

export function getLabelForInvitationState(state: InvitationStateType | undefined): string {
  const found = invitationStates.find((re) => {
    return re.value == state;
  });

  return found ? gettext(found.label) : t`Unknown State`;
}
