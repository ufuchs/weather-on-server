'Weather-on-server' depends on

Node.js

phantomjs

pngcrush

### Node.js

A good point to start is:

https://github.com/joyent/node

and please follow the instruction.

Be aware of nodejs from your package magment:

At the most deprecated.

For Rasperry Pi Users:

Here you can find a crosscompiled binary for the ARM cpu

http://nodejs.org/dist/v0.10.6/node-v0.10.6-linux-arm-pi.tar.gz

### phantomjs, pngcrush 

On your Linux host you should install those binaries per package manager

e.g: 

apt-get update && apt-get install phantomjs pngcrush

### Wunderground API key

The weather data comes from Wunderground.

Wunderground provides a free developer account with 500 calls per day.

The only thing you need is an so called API key.

You can get it for free at:

http://www.wunderground.com/weather/api/

http://www.wunderground.com/weather/api/d/pricing.html

This API key must be bound on the env variable 'WONDERGROUND_KEY' in the 'weather.sh' file.

Good luck and every positive critics are welcome!
