import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Image, Layer, Sprite } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import assets from '../css/assets'
import frames from '../utils/frames'
import PLAYER_STATUS from '../constants/player-status'

const SPRITE_FRAME_WIDTH = 153
const SPRITE_FRAME_HEIGHT = 400

class Spotlight extends Component {
  static propTypes = {
    sprite: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    yOffset: PropTypes.number.isRequired,
    power: PropTypes.number.isRequired,
    gameState: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  render () {
    let opacity = 1

    if (this.props.status !== PLAYER_STATUS.FASTEST) {
      opacity = 0
    }

    return (
      <Sprite
        ref={this.setSprite}
        opacity={opacity}
        image={assets.get(this.props.sprite)}
        x={this.props.x + 120}
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

