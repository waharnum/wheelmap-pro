import {t, gettext} from 'c-3po';

export type EventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';

export const eventStatusLabels = Object.freeze([
  {label: t`Draft`, value: 'draft'},
  {label: t`Planned`, value: 'planned'},
  {label: t`Ongoing`, value: 'ongoing'},
  {label: t`Completed`, value: 'completed'},
  {label: t`Canceled`, value: 'canceled'},
]) as ReadonlyArray<{ label: string, value: EventStatusEnum }>;

export function getLabelForEventStatus(state: EventStatusEnum | undefined): string {
  const found = eventStatusLabels.find((re) => {
    return re.value == state;
  });

  return found ? gettext(found.label) : t`Unknown Status`;
}
