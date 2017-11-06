import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Image, Layer, Sprite } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import { addAnimateable, removeAnimateable } from './animator'
import assets from '../css/assets'
import PLAYER_STATUS from '../constants/player-status'
class Sky extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    gameState: PropTypes.string.isRequired
  }

  state = {
    animating: false,
    colour: 'transparent'
  }

  componentDidMount () {
    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  animate = () => {
    let colour = '#' + Math.floor(Math.random()*16777215).toString(16)

    this.setState({
      colour
    })
  }

  render () {
    let colour = this.state.colour
    let showSky = this.props.players.some(player => player.status === PLAYER_STATUS.FASTEST)

    if (!showSky) {
      colour = 'transparent'
    }

    return (
      <Image
        fill={colour}
        x={0}
        y={0}
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
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
)(Sky)
