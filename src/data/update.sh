#!/bin/bash

set -e

# Set default value for MESHDB_HOST if not already set
: "${MESHDB_HOST:=db.nycmesh.net}"

curl -s -f -L -o kiosks.new.json "https://$MESHDB_HOST/api/v1/mapdata/kiosks/?format=json"
jq . kiosks.new.json
if [ "$(jq length kiosks.new.json)" -lt "5" ]; then echo "Kiosk list too small"; exit 1; fi
mv kiosks.new.json kiosks.json

curl -s -f -L -o nodes.new.json "https://$MESHDB_HOST/api/v1/mapdata/nodes/?format=json"
jq . nodes.new.json
if [ "$(jq length nodes.new.json)" -lt "5" ]; then echo "Node list too small"; exit 1; fi
mv nodes.new.json nodes.json

curl -s -f -L -o links.new.json "https://$MESHDB_HOST/api/v1/mapdata/links/?format=json"
jq . links.new.json
if [ "$(jq length links.new.json)" -lt "5" ]; then echo "Links list too small"; exit 1; fi
mv links.new.json links.json

curl -s -f -L -o sectors.new.json "https://$MESHDB_HOST/api/v1/mapdata/sectors/?format=json"
jq . sectors.new.json
if [ "$(jq length sectors.new.json)" -lt "5" ]; then echo "Sectors list too small"; exit 1; fi
mv sectors.new.json sectors.json

