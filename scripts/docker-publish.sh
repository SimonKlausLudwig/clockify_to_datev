#!/usr/bin/env sh
set -e

TAG=$(cat package.json \
  | grep tag \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

docker tag $TAG:build  $TAG:$VERSION
docker tag $TAG:build  $TAG:latest

echo "Push $TAG:$VERSION and $TAG:latest"

docker push $TAG:$VERSION
docker push $TAG:latest
