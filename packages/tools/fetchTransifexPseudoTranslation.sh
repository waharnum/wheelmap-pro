#!/bin/bash

echo Downloading fake translation as de-DE...
curl -L --user "api:$TRANSIFEX_API_KEY" -X GET \
     "https://www.transifex.com/api/2/project/wheelmap-pro/resource/strings/pseudo/?pseudo_type=MIXED" \
      | jq -r .content > ./i18n/de-DE.po
echo
