import jasmine from 'xolvio-jasmine-expect';

const expect = jasmine.expect;

jasmine.addMatchers({
  toEndWith: () => {
    return {
      compare: (actual, substring) => {
        const result = {
          pass: actual.endsWith(substring)
        };
        return result;
      }
    }
  }
});

export default expect;
