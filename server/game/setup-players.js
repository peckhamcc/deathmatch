
const BIKE_WEIGHT_KG = 7.5
const SECONDS_IN_AN_HOUR = 3600
const METERS_IN_A_KM = 1000
const AVERAGE_SPEED_KPH = 45

// https://en.wikipedia.org/wiki/List_of_world_records_in_track_cycling
const MENS_OLYMPIC_FLYING_500_M_RECORD = 24.758 // Chris Hoy
const WOMENS_OLYMPIC_FLYING_500_M_RECORD = 28.970 // Kristina Vogel

// elite diff
const DIFF = MENS_OLYMPIC_FLYING_500_M_RECORD / WOMENS_OLYMPIC_FLYING_500_M_RECORD

//const MENS_CX_WATTS = 106.8
//const WOMENS_CX_WATTS = 75.4

// normal diff
//const DIFF = WOMENS_CX_WATTS / MENS_CX_WATTS

const setUpPlayers = (riders, trackLength) => {
  return riders
    .map(rider => {
      return JSON.parse(JSON.stringify(rider))
    })
    .map(rider => {
      const speedKph = AVERAGE_SPEED_KPH
      const speedMps = (speedKph * METERS_IN_A_KM) / SECONDS_IN_AN_HOUR
      const newtons = (BIKE_WEIGHT_KG + rider.weight) * speedMps
      const joules = newtons * trackLength

      rider.totalJoules = 0
      rider.targetJoules = joules

      if (rider.gender === 'female') {
        rider.targetJoules *= DIFF
      }

      return rider
    })
}

module.exports = setUpPlayers
