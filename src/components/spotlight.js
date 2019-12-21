import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Sprite } from 'react-konva'
import assets from '../css/assets'
import frames from '../utils/frames'
import PLAYER_STATUS from '../constants/player-status'
import GAME_STATE from '../constants/game-state'
import playerPosition from '../constants/player-position'
import { addAnimateable, removeAnimateable } from './animator'
import { PLAYER_SPRITE_WIDTH } from './player'

const SPRITE_FRAME_WIDTH = 153
const SPRITE_FRAME_HEIGHT = 400

class Spotlight extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    sprite: PropTypes.string.isRequired,
    yOffset: PropTypes.number.isRequired,
    gameState: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }

  state = {
    x: 0
  }

  componentDidMount() {
    this.setState({
      x: 0 - PLAYER_SPRITE_WIDTH + 120
    })

    playerPosition[this.props.index] = 0 - PLAYER_SPRITE_WIDTH + 120

    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  animate = () => {
    this.setState({
      x: playerPosition[this.props.index] + 120
    })
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  render () {
    let opacity = 1

    if (this.props.status !== PLAYER_STATUS.MAX || this.props.gameState === GAME_STATE.countingDown) {
      opacity = 0
    }

    return (
      <Sprite
        ref={this.setSprite}
        opacity={opacity}
        image={assets.get(this.props.sprite)}
        x={this.state.x}
        y={0 + this.props.yOffset}
        width={SPRITE_FRAME_WIDTH}
        height={SPRITE_FRAME_HEIGHT}
        animation='default'
        animations={{
          default: frames(SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT, 0, 12)
        }}
        frameRate={8}
        frameIndex={this.sprite && this.sprite.frameIndex() || 0}
        scale={{
          x: 2,
          y: 2
        }}
      />
    )
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
)(Spotlight)

