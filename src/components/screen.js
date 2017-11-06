import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Image, Layer, Sprite } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import backgroundExplosion from '../../assets/background-explosion.png'
import backgroundBlueTunnel from '../../assets/background-blue-tunnel.png'
import assets from '../css/assets'
import GAME_STATE from '../constants/game-state'
import PLAYER_STATUS from '../constants/player-status'
import frames from '../utils/frames'

const ANIMATIONS = ['blue', 'explosion']

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
      if (this.props.gameState !== GAME_STATE.countingDown && this.props.players.some(player => player.status === PLAYER_STATUS.FASTEST)) {
        this.setState({
          image: ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
        })
      } else {
        this.setState({
          image: 'transparent'
        })
      }
    }, 200)
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
      blue: () => (
        <Sprite
          ref={this.setSprite}
          image={assets.get(backgroundBlueTunnel)}
          x={-87}
          y={-150}
          width={STAGE_WIDTH}
          height={STAGE_WIDTH}
          animation='default'
          animations={{
            default: frames(240, 260, 0, 4)
          }}
          frameRate={8}
          frameIndex={this.sprite && this.sprite.frameIndex() || 0}
          scale={{
            x: 5,
            y: 5
          }}
        />
      ),
      explosion: () => (
        <Sprite
          ref={this.setSprite}
          image={assets.get(backgroundExplosion)}
          x={0}
          y={0}
          width={STAGE_WIDTH}
          height={STAGE_WIDTH}
          animation='default'
          animations={{
            default: frames(500, 281, 0, 22)
          }}
          frameRate={8}
          frameIndex={this.sprite && this.sprite.frameIndex() || 0}
          scale={{
            x: 2.5,
            y: 2.5
          }}
        />
      )
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

