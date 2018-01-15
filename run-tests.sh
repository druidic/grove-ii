#!/usr/bin/env bash

mkdir .build &>/dev/null
cat \
  poppins.js \
  injector.js \
  localStorage.js \
  files.js \
  test/test-files.js \
  test/test-randomId.js \
  > .build/test.js

jasmine .build/test.js
