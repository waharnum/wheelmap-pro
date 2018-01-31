#!/bin/bash

[ -f "used-strings.pot" ] || { echo "pot file not found. Run meteor npm run collectTranslations" ; exit 1 ; }

msgcat used-strings.pot \
       node_modules/wheelmap-react/public/i18n/translations.pot \
       node_modules/@sozialhelden/ac-format/dist/ac-format.pot  > combined-strings.pot

rm used-strings.pot
