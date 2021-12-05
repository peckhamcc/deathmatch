import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Group, Text, Sprite } from 'react-konva'
import { addAnimateable, removeAnimateable } from './animator.js'
import GAME_STATE from '../constants/game-state.js'
import rangeMap from 'range-map'
import assets from '../css/assets.js'
import frames from '../utils/frames.js'
import playerPosition from '../constants/player-position.js'
import POWER from '../constants/power.js'

export const PLAYER_SPRITE_WIDTH = 500
export const PLAYER_SPRITE_HEIGHT = 400
export const NAME_SIZE = 24
export const UPDATE_FREQUENCY_MS = 1000

const ANIMATION_FRAMES = {
  riding: 16,
  fast: 16,
  faster: 16,
  fastest: 16
}

class Player extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    player: PropTypes.object.isRequired,
    gameState: PropTypes.string.isRequired,
    xOffset: PropTypes.number.isRequired,
    yOffset: PropTypes.number.isRequired,
    sprite: PropTypes.string.isRequired
  }

  state = {
    animation: 'riding',
    x: 0,
    nextX: 0,
    lastX: 0,
    startXTime: 0
  }

  componentDidMount() {
    this.setState({
      x: 0 - PLAYER_SPRITE_WIDTH
    })

    playerPosition[this.props.index] = 0 - PLAYER_SPRITE_WIDTH

    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState(s => ({
      lastX: s.nextX,
      nextX: this.props.player.x,
      startXTime: Date.now()
    }))
  }

  animate = () => {
    let x = this.state.x
    let animation = 'riding'

    if (this.props.gameState === GAME_STATE.countingDown) {
      x = x + 2
    } else if (this.props.gameState === GAME_STATE.finishing) {
      // animation = 'lunge'
      x = x + 10
    } else {
      const through = Date.now() - this.state.startXTime

      if (this.props.player.power > POWER.FASTEST) {
        animation = 'fastest'
      } else if (this.props.player.power > POWER.FASTER) {
        animation = 'faster'
      } else if (this.props.player.power > POWER.FAST) {
        animation = 'fast'
      } else {
        animation = 'riding'
      }

      x = rangeMap(through > UPDATE_FREQUENCY_MS ? UPDATE_FREQUENCY_MS : through, 0, UPDATE_FREQUENCY_MS, this.state.lastX, this.state.nextX)
    }

    this.setState(s => {
      return {
        animation,
        x
      }
    })

    playerPosition[this.props.index] = x
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  render () {
    const rps = (this.props.player.cadence || 60) / 60
    let fps = parseInt(rps * ANIMATION_FRAMES[this.state.animation], 10)

    return (
      <Group>
        <Text
          text={this.props.player.name}
          x={this.state.x + this.props.xOffset}
          y={this.props.yOffset}
          fill='black'
          fontFamily='"Press Start 2P", monospace'
          fontSize={NAME_SIZE}
          shadowColor='white'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Sprite
          ref={(ref) => this.setSprite(ref)}
          image={assets.get(this.props.sprite)}
          x={this.state.x}
          y={this.props.yOffset + NAME_SIZE}
          width={PLAYER_SPRITE_WIDTH}
          height={PLAYER_SPRITE_HEIGHT}
          animation={this.state.animation}
          animations={{
            riding: frames(PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_HEIGHT * 0, ANIMATION_FRAMES['riding']),
            fast: frames(PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_HEIGHT * 1, ANIMATION_FRAMES['fast']),
            faster: frames(PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_HEIGHT * 2, ANIMATION_FRAMES['faster']),
            fastest: frames(PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_HEIGHT * 3, ANIMATION_FRAMES['fastest'])
          }}
          frameRate={fps}
          frameIndex={this.sprite ? this.sprite.frameIndex() : 0}
        />
      </Group>
    )
  }
}

const mapStateToProps = ({ game: { state } }) => ({
  gameState: state
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player)
