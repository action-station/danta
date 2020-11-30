#!/usr/bin/env bash

if [ -z ${1+x} ]; then
  echo "ERROR: page slug is required"
  exit 1
fi

fetch_data () {
  node -r esm ./scripts/compile_data.js $1 $2 > ./data.json
}

build_index () {
  mustache \
    -p ./templates/head.mustache \
    -p ./templates/preloader.mustache \
    -p ./templates/logo.mustache \
    -p ./templates/navigation.mustache \
    -p ./templates/sub_card.mustache \
    -p ./templates/social_icons.mustache \
    ./data.json ./templates/index.mustache ./website/index.html
}

if [ "$2" = "--production" ]; then
  echo -n "PRODUCTION build..."
  fetch_data $1 $2
  build_index
  echo "DONE"
else
  echo -n "DEVELOPMENT build..."
  fetch_data $1

  while true
  do
    build_index
    sleep 5
  done
fi
