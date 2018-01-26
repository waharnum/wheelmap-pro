import {t, gettext} from 'c-3po';
import {colors} from '../../../ui/stylesheets/colors';

export type EventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';

export const eventStatusLabels = Object.freeze([
  {label: t`Draft`, value: 'draft', color: colors.ctaDisabledGrey},
  {label: t`Planned`, value: 'planned', color: colors.linkBlue},
  {label: t`Ongoing`, value: 'ongoing', color: colors.activeOrange},
  {label: t`Completed`, value: 'completed', color: colors.ctaGreen},
  {label: t`Canceled`, value: 'canceled', color: colors.errorRed},
]) as ReadonlyArray<{ label: string, value: EventStatusEnum, color: string }>;

export function getColorForEventStatus(state: EventStatusEnum | undefined): string {
  const found = eventStatusLabels.find((re) => {
    return re.value === state;
  });

  return found ? found.color : '#ccc';
}

export function getLabelForEventStatus(state: EventStatusEnum | undefined): string {
  const found = eventStatusLabels.find((re) => {
    return re.value === state;
  });

  return found ? gettext(found.label) : t`Unknown Status`;
}
