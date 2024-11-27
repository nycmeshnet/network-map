#!/bin/bash

set -e

# Set default value for MESHDB_HOST if not already set
: "${MESHDB_HOST:=db.nycmesh.net}"

curl -s -f -L -o kiosks.new.json "http://$MESHDB_HOST/api/v1/mapdata/kiosks/?format=json"
jq . kiosks.new.json
mv kiosks.new.json kiosks.json

curl -s -f -L -o nodes.new.json "http://$MESHDB_HOST/api/v1/mapdata/nodes/?format=json"
jq . nodes.new.json
mv nodes.new.json nodes.json

curl -s -f -L -o links.new.json "http://$MESHDB_HOST/api/v1/mapdata/links/?format=json"
jq . links.new.json
mv links.new.json links.json

curl -s -f -L -o sectors.new.json "http://$MESHDB_HOST/api/v1/mapdata/sectors/?format=json"
jq . sectors.new.json
mv sectors.new.json sectors.json

