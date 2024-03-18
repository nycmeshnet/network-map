#!/bin/bash

curl "http://127.0.0.1:8000/api/v1/mapdata/nodes/?format=json" > nodes.json
curl "http://127.0.0.1:8000/api/v1/mapdata/links/?format=json" > links.json
curl "http://127.0.0.1:8000/api/v1/mapdata/sectors/?format=json" > sectors.json