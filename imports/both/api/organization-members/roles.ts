import {t} from 'c-3po';

export type RoleType = 'manager' | 'developer' | 'founder' | 'volunteer' | 'member';

export const roles = Object.freeze([
  {label: t`Manager`, value: 'manager'},
  {label: t`Developer`, value: 'developer'},
  {label: t`Founder'`, value: 'founder'},
  {label: t`Volunteer`, value: 'volunteer'},
  {label: t`Member`, value: 'member'},
]) as ReadonlyArray<{ label: string, value: RoleType }>;

export const AdministrativeRoles = Object.freeze(
  ['manager', 'developer', 'founder'],
) as ReadonlyArray<RoleType>;

export function getLabelForRole(role: RoleType): string {
  const found = roles.find((re) => {
    return re.value == role;
  });

  return found ? found.label : t`Unknown Role`;
}
