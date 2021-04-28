#!/usr/bin/env sh
set -e

TAG=$(cat package.json \
  | grep tag \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "Build $TAG"

docker build -t "$TAG":build .
