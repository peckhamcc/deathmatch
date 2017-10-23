const debug = require('debug')('devices')
const bluetooth = require('./bluetooth')
const { load, save } = require('./files')

let devices = load('devices.json')

module.exports = {
  get: () => devices,

  startSearching: () => {
    bluetooth.startSearch()
  },

  stopSearching: () => {
    bluetooth.stopSearching()
  }
}
