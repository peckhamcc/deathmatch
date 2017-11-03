

import clubLogo from '../../assets/pcc-logo@2x.png'
import finishLineImage from '../../assets/finish-line.png'
import backgroundClouds from '../../assets/background-clouds.png'
import backgroundCity from '../../assets/background-city.png'
import backgroundTerraces from '../../assets/background-terraces.png'
import backgroundRoad from '../../assets/background-road.png'
import backgroundExplosion from '../../assets/background-explosion.png'
import backgroundBlueTunnel from '../../assets/background-blue-tunnel.png'
import introBackground from '../../assets/intro.png'
import powerBar from '../../assets/background-power.png'
import riderASprite from '../../assets/rider-a-sprite.png'
import riderBSprite from '../../assets/rider-b-sprite.png'
import riderMale0 from '../../assets/rider-male-0.png'
import riderMale1 from '../../assets/rider-male-1.png'
import riderMale2 from '../../assets/rider-male-2.png'
import riderFemale0 from '../../assets/rider-female-0.png'
import riderFemale1 from '../../assets/rider-female-1.png'
import riderFemale2 from '../../assets/rider-female-2.png'
import pccAvatar from '../../assets/pcc-avatar.png'
import player1Outline from '../../assets/player1-outline.png'
import player2Outline from '../../assets/player2-outline.png'

const list = [
  clubLogo,
  finishLineImage,
  backgroundClouds,
  backgroundCity,
  backgroundTerraces,
  backgroundRoad,
  backgroundExplosion,
  backgroundBlueTunnel,
  introBackground,
  powerBar,
  riderASprite,
  riderBSprite,
  riderMale0,
  riderMale1,
  riderMale2,
  riderFemale0,
  riderFemale1,
  riderFemale2,
  pccAvatar,
  player1Outline,
  player2Outline
]

const assets = {}

module.exports = {
  load: (riders, progress, cb) => {
    riders.forEach(rider => {
      if (rider.photoSelect) {
        list.push(rider.photoSelect)
      }
  
      if (rider.photoWin) {
        list.push(rider.photoWin)
      }
  
      if (rider.photoLose) {
        list.push(rider.photoLose)
      }
  
      if (rider.photoPower) {
        list.push(rider.photoPower)
      }
    })
  
    let remaning = list.length
  
    Promise.all(list.map(asset => {
      return new Promise((resolve, reject) => {
        const image = new window.Image()
        image.src = asset
        image.onload = () => {
          assets[asset] = image
  
          remaning -= 1
  
          progress(remaning, list.length)
  
          resolve()
        }
      })
    }))
    .then(() => cb())
    .catch(error => cb(error))
  },

  get: (key) => {
    return assets[key]
  }
}
