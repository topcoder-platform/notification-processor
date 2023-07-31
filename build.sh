#!/bin/bash
set -eo pipefail
UPDATE_CACHE=""
echo "" >docker/api.env
docker-compose -f docker/docker-compose.yml build submission-notification-processor
docker create --name app submission-notification-processor:latest

if [ -d node_modules ]
then
  mv yarn.lock old-yarn.lock
  docker cp app:/submission-notification-processor/yarn.lock yarn.lock
  set +eo pipefail
  UPDATE_CACHE=$(cmp yarn.lock old-yarn.lock)
  set -eo pipefail
else
  UPDATE_CACHE=1
fi

if [ "$UPDATE_CACHE" == 1 ]
then
  docker cp app:/submission-notification-processor/node_modules .
fi