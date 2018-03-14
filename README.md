# wheelmap.pro

A meteor application for hosting communities around accessibility.cloud.

## Running the application locally

```
# install meteor on your system
curl https://install.meteor.com | /bin/sh

# clone the repo
git clone git@github.com:sozialhelden/wheelmap-pro

# enter the project directory
cd wheelmap-pro 

# [optional] install patched packages
cd packages
git clone git@github.com:framefield/accounts-bootstrap.git std_accounts-bootstrap
git clone git@github.com:framefield/accounts-ui.git std_accounts-ui
cd ..

# install the needed dependencies and packages
meteor npm install

# start the application
meteor 

# to start with local settings
# meteor --settings settings/local-example.json

# now open http://localhost:3000/ in the browser of your choice!

```
