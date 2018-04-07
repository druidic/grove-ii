#!/usr/bin/env bash

mkdir .build &>/dev/null
cat \
  files.js \
  test/test-files.js \
  test/test-randomId.js \
  > .build/test.js

jasmine .build/test.js
