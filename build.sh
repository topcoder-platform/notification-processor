#!/bin/bash
set -eo pipefail
UPDATE_CACHE=""
echo "" >docker/api.env
docker-compose -f docker/docker-compose.yml build submission-notification-processor
docker create --name app submission-notification-processor:latest

if [ -d node_modules ]
then
  mv package-lock.json old-package-lock.json
  docker cp app:/submission-notification-processor/package-lock.json package-lock.json
  set +eo pipefail
  UPDATE_CACHE=$(cmp package-lock.json old-package-lock.json)
  set -eo pipefail
else
  UPDATE_CACHE=1
fi

if [ "$UPDATE_CACHE" == 1 ]
then
  docker cp app:/submission-notification-processor/node_modules .
fi