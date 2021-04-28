#!/usr/bin/env sh
set -e

TAG=$(cat package.json \
  | grep tag \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

PORT=$(cat package.json \
  | grep port \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

docker run -p 4091:4091 $TAG:build
