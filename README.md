# Peckham Cycle Club Deathmatch Simulator

A turbo trainer based game for two or more players.

Demo: [https://peckhamcc.github.io/deathmatch/](https://peckhamcc.github.io/deathmatch/)

## Requirements

1. A laptop with bluetooth
1. 2x Turbo trainers and/or power/cadence meters that can talk over bluetooth

## Getting started

1. Clone this repo
1. `npm i`
1. `npm start`
1. [http://localhost:5000](http://localhost:5000)

## Hardware

An Arduino with a Seeed Grove base shield and a DMX controller attached to port D3.

It should be running the following sketch:

```c
#include <DmxSimple.h>

void setup() {
  Serial.begin(9600);
  DmxSimple.usePin(3);
  DmxSimple.maxChannel(48);
}

int value = 0;
int channel;

void loop() {
  int c;

  while(!Serial.available()) {

  }

  c = Serial.read();

  if ((c >= '0') && (c <= '9')) {
    value = 10*value + c - '0';
  } else {
    if (c=='c') {
      channel = value;
    } else if (c=='w') {
      DmxSimple.write(channel, value);
    }

    value = 0;
  }
}
```

- A Dome light set to A001
- A Mini Spider Light in 15 channel mode set to A07
- A Mini Spider Light in 15 channel mode set to A022
- A LaserWorld EL-230RGB set to channel A037
