#!/bin/sh

#  It's good practise to keep your secrets in the
#+ env instead in a file
export WONDERGROUND_KEY=Your key from Wunderground

node weather.js &

