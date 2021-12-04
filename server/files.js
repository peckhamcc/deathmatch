import { readFileSync, writeFileSync } from 'fs'
import debug from 'debug'

const log = debug('deathmatch:files')

export function load (file, defaultValue = []) {
  try {
    return JSON.parse(readFileSync(file))
  } catch (error) {
    log(error)

    return JSON.parse(JSON.stringify(defaultValue))
  }
}

export function save (array, file) {
  try {
    return writeFileSync(file, JSON.stringify(array, null, 2))
  } catch (error) {
    log(error)
  }
}
