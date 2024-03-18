#!/bin/bash

set -e

# Set default value for MESHDB_HOST if not already set
: "${MESHDB_HOST:=db.nycmesh.net}"

KIOSKS_JSON=$(curl -s -f -L "http://$MESHDB_HOST/api/v1/mapdata/kiosks/?format=json")
echo $KIOSKS_JSON > kiosks.json

NODES_JSON=$(curl -s -f -L "http://$MESHDB_HOST/api/v1/mapdata/nodes/?format=json")
echo $NODES_JSON > nodes.json

LINKS_JSON=$(curl -s -f -L "http://$MESHDB_HOST/api/v1/mapdata/links/?format=json")
echo $LINKS_JSON > links.json

SECTORS_JSON=$(curl -s -f -L "http://$MESHDB_HOST/api/v1/mapdata/sectors/?format=json")
echo $SECTORS_JSON > sectors.json

