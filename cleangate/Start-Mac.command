#!/bin/bash
cd "$(dirname "$0")"
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="file://$PWD/index.html"
else
  open index.html
fi
