import clubLogo from '../../assets/pcc-logo@2x.png'
import finishLineImage from '../../assets/finish-line.png'
import backgroundClouds from '../../assets/background-clouds.png'
import backgroundCity from '../../assets/background-city.png'
import backgroundTerraces from '../../assets/background-terraces.png'
import backgroundRoad from '../../assets/background-road.png'
import backgroundPeckham from '../../assets/background-peckham.png'
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
import riderASpotlight from '../../assets/rider-a-spotlight.png'
import riderBSpotlight from '../../assets/rider-b-spotlight.png'
import stripes from '../../assets/stripes.png'
import screenBatman from '../../assets/screen-batman.png'
import screenDog from '../../assets/screen-dog.png'
import screenFalcon from '../../assets/screen-falcon.png'
import screenKim from '../../assets/screen-kim.png'
import screenNuclear from '../../assets/screen-nuclear.png'
import screenPow from '../../assets/screen-pow.png'
import screenScream from '../../assets/screen-scream.png'
import screenTunnel from '../../assets/screen-tunnel.png'
import screenWrestler from '../../assets/screen-wrestler.png'
import screenSantaRudolph from '../../assets/screen-santa-rudolph.png'
import screenChristmasHouse from '../../assets/screen-christmas-house.png'
import screenMegaSanta from '../../assets/screen-mega-santa.png'
import screenSausageRolls1 from '../../assets/screen-sausage-rolls-1.png'
import screenSausageRolls2 from '../../assets/screen-sausage-rolls-2.png'
import screenSausageRolls3 from '../../assets/screen-sausage-rolls-3.png'
import screenSausageRolls4 from '../../assets/screen-sausage-rolls-4.png'
import tape from '../../assets/tape.gif'

const list = [
  clubLogo,
  finishLineImage,
  backgroundClouds,
  backgroundCity,
  backgroundTerraces,
  backgroundRoad,
  backgroundPeckham,
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
  player2Outline,
  riderASpotlight,
  riderBSpotlight,
  stripes,
  screenBatman,
  screenDog,
  screenFalcon,
  screenKim,
  screenNuclear,
  screenPow,
  screenScream,
  screenTunnel,
  screenWrestler,
  screenSantaRudolph,
  screenChristmasHouse,
  screenMegaSanta,
  screenSausageRolls1,
  screenSausageRolls2,
  screenSausageRolls3,
  screenSausageRolls4,
  tape
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
