const shortid = require('shortid')
const { writeFileSync } = require('fs')
const path = require('path')

module.exports = {

  upload: (photo) => {
    const id = shortid.generate()

    writeFileSync(path.join(path.resolve(path.join(__dirname, '..', 'photos')), `${id}.png`), photo.replace(/^data:image\/\w+;base64,/, ''), {
      encoding: 'base64'
    })

    return `/deathmatch/photos/${id}.png`
  }
}
