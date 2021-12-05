#!/bin/bash

convert ./assets/tiles/rider-a-riding-*.png +append -resize x400 ./assets/rider-a-riding.png
convert ./assets/tiles/rider-a-fast-*.png +append -resize x400 ./assets/rider-a-fast.png
convert ./assets/tiles/rider-a-faster-*.png +append -resize x400 ./assets/rider-a-faster.png
convert ./assets/tiles/rider-a-fastest-*.png +append -resize x400 ./assets/rider-a-fastest.png
convert ./assets/rider-a-riding.png ./assets/rider-a-fast.png ./assets/rider-a-faster.png ./assets/rider-a-fastest.png -append -quality 95 -depth 8 ./assets/rider-a-sprite.png
rm ./assets/rider-a-riding.png ./assets/rider-a-fast.png ./assets/rider-a-faster.png ./assets/rider-a-fastest.png

convert ./assets/tiles/rider-b-riding-*.png +append -resize x400 ./assets/rider-b-riding.png
convert ./assets/tiles/rider-b-fast-*.png +append -resize x400 ./assets/rider-b-fast.png
convert ./assets/tiles/rider-b-faster-*.png +append -resize x400 ./assets/rider-b-faster.png
convert ./assets/tiles/rider-b-fastest-*.png +append -resize x400 ./assets/rider-b-fastest.png
convert ./assets/rider-b-riding.png ./assets/rider-b-fast.png ./assets/rider-b-faster.png ./assets/rider-b-fastest.png -append -quality 95 -depth 8 ./assets/rider-b-sprite.png
rm ./assets/rider-b-riding.png ./assets/rider-b-fast.png ./assets/rider-b-faster.png ./assets/rider-b-fastest.png

convert ./assets/tiles/background-laser-*.png +append ./assets/background-laser.png
