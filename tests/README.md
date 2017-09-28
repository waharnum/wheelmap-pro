
# Testing wheelmap-pro

## Installation

Make sure you install chimp on the system 

    npm install --global chimp
    
## Running Tests

Start meteor in test mode, so it will not interfere with your existing database:
    
    meteor test --settings settings/local.json --full-app --driver-package tmeasday:acceptance-test-driver

Start chimp in watch-mode in another terminal, at the root of the project:
    
    chimp --ddp=http://localhost:3000 --watch --mocha --path=tests    

Now all tests from the tests folder will be automatically run and re-run whenever the test files are changed.    

Or to just run the tests once:

    chimp --mocha --path=tests    

For running with a special config

- Create a config file, e.g. `test/chimp.js` - make sure it contains the text `chimp`!
- Add any options you desire
- Default options are at https://github.com/xolvio/chimp/blob/master/src/bin/default.js
- See also https://chimp.readme.io/docs/command-line-options
- Pass this config as the first argument to the chimp call
    `chimp test/chimp.js --other-args --follow --here`

An example for a config changing the default chrome path is

    module.exports = {
        webdriverio: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    binary: '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
                }
            }
        }
    }    


## Continuous integration

- TBD

## Notes

- We cannot currently write tests in typescript
  https://github.com/xolvio/chimp/issues/479

## Additional Links

- https://guide.meteor.com/testing.html#acceptance-testing
- https://chimp.readme.io/docs/getting-started-with-meteor-cucumber
- https://atmospherejs.com/xolvio/backdoor
- https://atmospherejs.com/xolvio/cleaner
