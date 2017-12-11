const { readFileSync, writeFileSync } = require('fs')
const debug = require('debug')('files')

module.exports = {
  load: (file, defaultValue = []) => {
    try {
      return JSON.parse(readFileSync(file))
    } catch (error) {
      debug(error)

      return JSON.parse(JSON.stringify(defaultValue))
    }
  },

  save: (array, file) => {
    try {
      return writeFileSync(file, JSON.stringify(array, null, 2))
    } catch (error) {
      debug(error)
    }
  }
}
