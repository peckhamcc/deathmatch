#!/bin/bash

convert ./assets/tiles/rider-a-m-riding-*.png +append -resize x400 ./assets/rider-a-m-riding.png
convert ./assets/tiles/rider-a-m-fast-*.png +append -resize x400 ./assets/rider-a-m-fast.png
convert ./assets/tiles/rider-a-m-faster-*.png +append -resize x400 ./assets/rider-a-m-faster.png
convert ./assets/tiles/rider-a-m-fastest-*.png +append -resize x400 ./assets/rider-a-m-fastest.png
convert ./assets/rider-a-m-riding.png ./assets/rider-a-m-fast.png ./assets/rider-a-m-faster.png ./assets/rider-a-m-fastest.png -append -quality 95 -depth 8 ./assets/rider-a-m-sprite.png
rm ./assets/rider-a-m-riding.png ./assets/rider-a-m-fast.png ./assets/rider-a-m-faster.png ./assets/rider-a-m-fastest.png

convert ./assets/tiles/rider-a-f-riding-*.png +append -resize x400 ./assets/rider-a-f-riding.png
convert ./assets/tiles/rider-a-f-fast-*.png +append -resize x400 ./assets/rider-a-f-fast.png
convert ./assets/tiles/rider-a-f-faster-*.png +append -resize x400 ./assets/rider-a-f-faster.png
convert ./assets/tiles/rider-a-f-fastest-*.png +append -resize x400 ./assets/rider-a-f-fastest.png
convert ./assets/rider-a-f-riding.png ./assets/rider-a-f-fast.png ./assets/rider-a-f-faster.png ./assets/rider-a-f-fastest.png -append -quality 95 -depth 8 ./assets/rider-a-f-sprite.png
rm ./assets/rider-a-f-riding.png ./assets/rider-a-f-fast.png ./assets/rider-a-f-faster.png ./assets/rider-a-f-fastest.png

convert ./assets/tiles/rider-b-m-riding-*.png +append -resize x400 ./assets/rider-b-m-riding.png
convert ./assets/tiles/rider-b-m-fast-*.png +append -resize x400 ./assets/rider-b-m-fast.png
convert ./assets/tiles/rider-b-m-faster-*.png +append -resize x400 ./assets/rider-b-m-faster.png
convert ./assets/tiles/rider-b-m-fastest-*.png +append -resize x400 ./assets/rider-b-m-fastest.png
convert ./assets/rider-b-m-riding.png ./assets/rider-b-m-fast.png ./assets/rider-b-m-faster.png ./assets/rider-b-m-fastest.png -append -quality 95 -depth 8 ./assets/rider-b-m-sprite.png
rm ./assets/rider-b-m-riding.png ./assets/rider-b-m-fast.png ./assets/rider-b-m-faster.png ./assets/rider-b-m-fastest.png

convert ./assets/tiles/rider-b-f-riding-*.png +append -resize x400 ./assets/rider-b-f-riding.png
convert ./assets/tiles/rider-b-f-fast-*.png +append -resize x400 ./assets/rider-b-f-fast.png
convert ./assets/tiles/rider-b-f-faster-*.png +append -resize x400 ./assets/rider-b-f-faster.png
convert ./assets/tiles/rider-b-f-fastest-*.png +append -resize x400 ./assets/rider-b-f-fastest.png
convert ./assets/rider-b-f-riding.png ./assets/rider-b-f-fast.png ./assets/rider-b-f-faster.png ./assets/rider-b-f-fastest.png -append -quality 95 -depth 8 ./assets/rider-b-f-sprite.png
rm ./assets/rider-b-f-riding.png ./assets/rider-b-f-fast.png ./assets/rider-b-f-faster.png ./assets/rider-b-f-fastest.png

convert ./assets/tiles/background-laser-*.png +append ./assets/background-laser.png
