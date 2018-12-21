const rangeMap = require('range-map')
const {
  write
} = require('./dmx-controller')

process.on('exit', () => {
  dome.rotate(0)
  dome.strobe(0)
  dome.colour(0, 0, 0)
})

const DOME = {
  OFFSET: 0,
  CONTROL: 1,
  RED: 2,
  GREEN: 3,
  BLUE: 4,
  ROTATE: 5,
  STROBE: 6
}

const SPIDER_LIGHT = {
  MOTOR_1: 1,
  MOTOR_2: 2,
  BRIGHTNESS: 3,
  STROBE: 4,
  RED1_DIMMING: 5,
  GREEN1_DIMMING: 6,
  BLUE1_DIMMING: 7,
  WHITE1_DIMMING: 8,
  RED2_DIMMING: 9,
  GREEN2_DIMMING: 10,
  BLUE2_DIMMING: 11,
  WHITE2_DIMMING: 12,
  MACRO_FUNCTION: 13,
  EFFECT_SPEED: 14,
  RESET: 15
}

const SPIDER_LIGHT_1 = {
  ...SPIDER_LIGHT,
  OFFSET: 6
}

const SPIDER_LIGHT_2 = {
  ...SPIDER_LIGHT,
  OFFSET: 21
}

const LASER = {
  OFFSET: 36,
  CONTROL: 1,
  PATTERN: 2,
  STROBE: 3,
  POINT_SPEED: 4,
  X_AXIS: 5,
  Y_AXIS: 6,
  ZOOM: 7,
  COLOUR: 8,
  RESET: 9,
  ROTATE_X: 10,
  ROTATE_Y: 11,
  ROTATE_Z: 12
}

const dome = (channel, value) => {
  write(DOME.OFFSET, channel, value)
}

dome.colour = (r, g, b, w = 0) => {
  dome(DOME.CONTROL, 150)

  if (w === 0) {
    dome(DOME.RED, r)
    dome(DOME.GREEN, g)
    dome(DOME.BLUE, b)
  } else {
    dome(DOME.RED, w)
    dome(DOME.GREEN, w)
    dome(DOME.BLUE, w)
  }
}

dome.rotate = (amount) => {
  dome(DOME.CONTROL, 150)
  dome(DOME.ROTATE, amount)
}

dome.strobe = (amount) => {
  // 0 is max strobe, 255 is off so switch it so 255 is max and 0 is off
  amount = 255 - amount

  dome(DOME.CONTROL, 250) // strobe mode is exclusive of everything else
  dome(DOME.STROBE, amount)
}

const spider = (offset) => {
  const output = (channel, value) => {
    write(offset, channel, value)
  }

  output.strobe = (amount) => {
    output(SPIDER_LIGHT.STROBE, amount)
  }

  output.motorPositon = (position) => {
    // 180 = straight up
    output(SPIDER_LIGHT.MOTOR_1, position)
    output(SPIDER_LIGHT.MOTOR_2, position)
  }

  let motorPositionInterval
  let lastMotorPosition = 0

  output.motorSpeed = (speed) => {
    clearInterval(motorPositionInterval)

    if (speed > 0) {
      lastMotorPosition = 0

      motorPositionInterval = setInterval(() => {
        lastMotorPosition++
        output.motorPositon(parseInt(rangeMap(Math.sin(lastMotorPosition), -1, 1, 0, 255)))
      }, rangeMap(speed, 1, 255, 1000, 10))
    }
  }

  output.colour = (r, g, b, w = 0) => {
    output.animate(0)
    output(SPIDER_LIGHT.BRIGHTNESS, 255)

    output(SPIDER_LIGHT.WHITE1_DIMMING, w)
    output(SPIDER_LIGHT.WHITE2_DIMMING, w)
    output(SPIDER_LIGHT.RED1_DIMMING, r)
    output(SPIDER_LIGHT.RED2_DIMMING, r)
    output(SPIDER_LIGHT.GREEN1_DIMMING, g)
    output(SPIDER_LIGHT.GREEN2_DIMMING, g)
    output(SPIDER_LIGHT.BLUE1_DIMMING, b)
    output(SPIDER_LIGHT.BLUE2_DIMMING, b)
  }

  output.animate = (speed) => {
    // macro functions
    // 10 - all on
    // 20 - strobe, all on
    // 30-110 - rotate all colours, various orderings
    // 120-220 - rotate, one side at a time
    // 230 - multi effects
    // 240 - multi effects with movement
    // 250 - sound activated

    if (speed === 0) {
      return output(SPIDER_LIGHT.MACRO_FUNCTION, 0) // turn off animation
    }

    output(SPIDER_LIGHT.MACRO_FUNCTION, 40)
    output(SPIDER_LIGHT.EFFECT_SPEED, speed)
  }

  return output
}

const spider1 = spider(SPIDER_LIGHT_1.OFFSET)
const spider2 = spider(SPIDER_LIGHT_2.OFFSET)

const laser = (channel, value) => {
  laser.on()
  write(LASER.OFFSET, channel, value)
}
laser.off = () => {
  write(LASER.OFFSET, LASER.CONTROL, 0)
}
laser.on = () => {
  write(LASER.OFFSET, LASER.CONTROL, 250)
}
laser.animate = (pattern = -1, interval = 1000) => {
  // 0 = horizontal line
  // 10 = messy line, vertical
  // 20 = messy line, scan up and down
  // 30 = messy line, horizontal
  // 40 = messy line, pointing towards centre
  // 50 = messe circle
  // 60 = vertical line, scan left to right
  // 70 = box, scan left to right
  // 80 = box, move around
  // 90 = vertical line, rotate
  // 100 = mess of lines, move around
  // 110 = three lines, grow vertically
  // 120 = horizontal lines, three tiered
  // 130 = circle grow and shrink
  // 140 = box grow and shrink
  // 150 = horizontal lines, scan up and down
  // 160 = messy circle, off-axis rotate
  // 180 = random points
  // 190 = messy square and ciral, move around
  // 200 = expanding circle
  // 210 = contracting circle
  // 220 = circle expand and contract
  // 230 = square, move around
  // 240 = square, contracting
  // 250 = square expand and contract
  clearInterval(laser._animationInterval)

  if (pattern === -1) {
    pattern = Math.floor(Math.random() * 255)
    laser(LASER.PATTERN, pattern)

    laser._animationInterval = setInterval(() => {
      pattern = Math.floor(Math.random() * 255)
      laser(LASER.PATTERN, pattern)
    }, interval)
  }

  laser(LASER.PATTERN, pattern)
}
laser.strobe = (amount) => {
  laser(LASER.STROBE, amount)
}
laser.colour = (r, g, b, w = 0) => {
  // 0 = white
  // 20 = red
  // 30 = green
  // 40 = blue
  // 80 = yellow
  // 100 = pink
  // 120 = multi coloured
  // 140 = multi coloured, changing

  if (!r && !g && !b && !w) {
    laser.off()
  } else if (r && !g && !b && !w) {
    laser(LASER.COLOUR, 20)
  } else if (!r && g && !b && !w) {
    laser(LASER.COLOUR, 40)
  } else if (!r && !g && b && !w) {
    laser(LASER.COLOUR, 60)
  } else if (!r && !g && !b && w) {
    laser(LASER.COLOUR, 0)
  } else {
    laser(LASER.COLOUR, 140)
  }
}

module.exports = {
  dome,
  spider1,
  spider2,
  laser
}
