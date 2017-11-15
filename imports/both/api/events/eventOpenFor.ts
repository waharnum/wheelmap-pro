import {t, gettext} from 'c-3po';

export type EventOpenForEnum = 'inviteOnly' | 'everyone';

export const openForLabels = Object.freeze([
  {label: t`Invite Only`, value: 'inviteOnly'},
  {label: t`Everyone`, value: 'everyone'},
]) as ReadonlyArray<{ label: string, value: EventOpenForEnum }>;

export function getLabelForOpenFor(state: EventOpenForEnum | undefined): string {
  const found = openForLabels.find((re) => {
    return re.value == state;
  });

  return found ? gettext(found.label) : t`Unknown value`;
}
