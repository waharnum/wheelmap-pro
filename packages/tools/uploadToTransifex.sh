#!/bin/bash

[ -f "used-strings.pot" ] || { echo "pot file not found. Run meteor npm run collectTranslations" ; exit 1 ; }

echo Uploading new pot file...
curl -i -L --user "api:$TRANSIFEX_API_KEY" -X PUT \
    -H "Content-type: multipart/form-data" \
    -F "i18n_type=POT" -F "content=@used-strings.pot" \
     "https://www.transifex.com/api/2/project/wheelmap-pro/resource/strings/content/"
echo
