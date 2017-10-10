declare module 'meteor/softwarerero:accounts-t9n' {
  module T9n {
    export function setLanguage(language: string): void;

    export function get(key: string | undefined): string;
  }
}
