import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Layer, Rect, Stage, Group, Text, Image, Sprite } from 'react-konva'
import riderSprite from '../../assets/rider-sprite.png'
import { addAnimateable, removeAnimateable } from './animator'
import GAME_STATE from '../constants/game-state'
import rangeMap from 'range-map'

const PlayerName = styled.div`
  background-color: #FFF;
  padding: 5px 10px;
  margin: 0;
  font-size: 16px;
  display: inline-block;
`

export const SPRITE_WIDTH = 500
export const SPRITE_HEIGHT = 400
export const NAME_SIZE = 24
export const UPDATE_FREQUENCY_MS = 1000

class Player extends Component {

  static propTypes = {
    player: PropTypes.object.isRequired,
    gameState: PropTypes.string.isRequired,
    xOffset: PropTypes.number.isRequired,
    yOffset: PropTypes.number.isRequired
  }

  state = {
    animation: 'riding',
    x: 0,
    nextX: 0,
    lastX: 0,
    startXTime: 0
  }

  componentDidMount() {
    const image = new window.Image()
    image.src = riderSprite
    image.onload = () => {
      this.setState({
        image: image
      })
    }

    this.setState({
      x: 0 - SPRITE_WIDTH
    })

    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(s => ({
      lastX: s.nextX,
      nextX: this.props.player.x,
      startXTime: Date.now()
    }))
  }

  animate = () => {
    if (this.props.gameState === GAME_STATE.countingDown) {
      return this.setState(s => {
        return {
          x: s.x + 2
        }
      })
    }

    if (this.props.gameState === GAME_STATE.finishing) {
      return this.setState(s => {
        return {
          //animation: 'lunge',
          x: s.x + 10
        }
      })
    }

    const through = Date.now() - this.state.startXTime

    this.setState(s => {
      return {
        animation: 'riding',
        x: rangeMap(through > UPDATE_FREQUENCY_MS ? UPDATE_FREQUENCY_MS : through, 0, UPDATE_FREQUENCY_MS, this.state.lastX, this.state.nextX)
      }
    })
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  render () {
    return (
      <Group>
        <Text
          text={this.props.player.name}
          x={this.state.x + this.props.xOffset}
          y={this.props.yOffset}
          fill='black'
          fontFamily='"Press Start 2P", cursive'
          fontSize={NAME_SIZE}
          shadowColor='white'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Sprite
          ref={this.setSprite}
          image={this.state.image}
          x={this.state.x}
          y={this.props.yOffset + NAME_SIZE}
          width={SPRITE_WIDTH}
          height={SPRITE_HEIGHT}
          animation={this.state.animation}
          animations={{
            riding: [
              0, 0, 500, 400,
              500, 0, 500, 400,
              1000, 0, 500, 400,
              1500, 0, 500, 400
            ]
          }}
          frameRate={4}
          frameIndex={this.sprite && this.sprite.frameIndex() || 0}
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
