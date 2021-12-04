import shortid from 'shortid'
import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function upload (photo) {
  const id = shortid.generate()

  writeFileSync(path.join(path.resolve(path.join(__dirname, '..', 'photos')), `${id}.png`), photo.replace(/^data:image\/\w+;base64,/, ''), {
    encoding: 'base64'
  })

  return `/deathmatch/photos/${id}.png`
}
