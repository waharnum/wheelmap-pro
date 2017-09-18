export function getDisplayedNameForUser(user, defaultName = 'Unknown user'): string {
  const name = user && user.username || user.emails && user.emails[0] && user.emails[0].address;
  return name || defaultName;
}
