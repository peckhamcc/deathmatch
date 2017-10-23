const { readFileSync,  writeFileSync } = require('fs')
const debug = require('debug')('files')

module.exports = {
  load: (file) => {
    try {
      return JSON.parse(readFileSync(file))
    } catch (error) {
      debug(error)
  
      return []
    }
  },

  save: (array, file) => {
    try {
      return writeFileSync(file, JSON.stringify(array))
    } catch (error) {
      debug(error)
    }
  }
}
