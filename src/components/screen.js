import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, Sprite } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import assets from '../css/assets'
import GAME_STATE from '../constants/game-state'
import PLAYER_STATUS from '../constants/player-status'
import frames from '../utils/frames'
import screenBatman from '../../assets/screen-batman.png'
import screenBike from '../../assets/screen-bike.png'
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

const ANIMATIONS = [
  'batman',
  'bike',
  'dog',
  'falcon',
  'kim',
  'nuclear',
  'pow',
  'scream',
  'tunnel',
  'wrestler',
  'santaRudolph',
  'christmasHouse',
  'megaSanta',
  'sausageRolls1',
  'sausageRolls2',
  'sausageRolls3',
  'sausageRolls4',
  'rider',
  'rider',
  'rider',
  'rider',
  'rider'
]

const VISIBLE_FOR = 1000

class Screen extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    gameState: PropTypes.string.isRequired
  }

  state = {
    animating: false,
    image: 'transparent'
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      if (this.props.gameState !== GAME_STATE.countingDown && this.props.players.some(player => player.status === PLAYER_STATUS.MAX)) {
        this.setState({
          image: ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
        })
      } else {
        this.setState({
          image: 'transparent'
        })
      }
    }, VISIBLE_FOR)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  createSprite = (sprite, width, height, numFrames) => {
    let scale = 1

    if (width > height) {
      // landscape, make height fill stage
      scale = Math.ceil(STAGE_HEIGHT / height)
    } else {
      // portrait, make width fill stage
      scale = Math.ceil(STAGE_WIDTH / width)
    }

    let frameRate = parseInt((1000 / VISIBLE_FOR) * numFrames, 10)

    if (numFrames < frameRate) {
      frameRate = numFrames
    }

    return (
      <Sprite
        ref={this.setSprite}
        image={assets.get(sprite)}
        x={(STAGE_WIDTH - (width * scale)) / 2}
        y={(STAGE_HEIGHT - (height * scale)) / 2}
        width={width * scale}
        height={height * scale}
        animation='default'
        animations={{
          default: frames(width, height, 0, numFrames)
        }}
        frameRate={frameRate}
        frameIndex={this.sprite && this.sprite.frameIndex() || 0}
        scale={{
          x: scale,
          y: scale
        }}
      />
    )
  }

  render () {
    const backgrounds = {
      transparent: () => (
        <Image
          opacity={0}
          x={0}
          y={0}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
        />
      ),
      batman: () => this.createSprite(screenBatman, 500, 269, 13),
      bike: () => this.createSprite(screenBike, 640, 640, 33),
      dog: () => this.createSprite(screenDog, 640, 640, 33),
      falcon: () => this.createSprite(screenFalcon, 500, 209, 19),
      kim: () => this.createSprite(screenKim, 687, 680, 44),
      nuclear: () => this.createSprite(screenNuclear, 200, 200),
      pow: () => this.createSprite(screenPow, 100, 100, 7),
      scream: () => this.createSprite(screenScream, 480, 268, 43),
      tunnel: () => this.createSprite(screenTunnel, 240, 160, 4),
      wrestler: () => this.createSprite(screenWrestler, 480, 320, 44),
      santaRudolph: () => this.createSprite(screenSantaRudolph, 450, 272, 22),
      christmasHouse: () => this.createSprite(screenChristmasHouse, 500, 282, 16),
      megaSanta: () => this.createSprite(screenMegaSanta, 450, 256, 14),
      sausageRolls1: () => this.createSprite(screenSausageRolls1, 640, 480, 8),
      sausageRolls2: () => this.createSprite(screenSausageRolls2, 640, 480, 8),
      sausageRolls3: () => this.createSprite(screenSausageRolls3, 640, 480, 8),
      sausageRolls4: () => this.createSprite(screenSausageRolls4, 640, 480, 8)
    }

    if (this.state.image === 'rider') {
      const rider = this.props.players.find(player => player.status === PLAYER_STATUS.MAX)

      if (rider && rider.photoPower) {
        return (
          <Image
            image={assets.get(rider.photoPower)}
            x={0}
            y={0}
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
          />
        )
      } else {
        return backgrounds.transparent()
      }
    }

    return backgrounds[this.state.image]()
  }
}

const mapStateToProps = ({ game: { state }, players: { players } }) => ({
  gameState: state,
  players
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)

