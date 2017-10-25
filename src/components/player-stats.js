import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layer, Rect, Stage, Group, Text, Image } from 'react-konva'
import rangeMap from 'range-map'
import FF7 from './ff7'
import GAME_STATE from '../constants/game-state'
import powerBar from '../../assets/background-power.png'

const FF7Canvas = ({ width, height, x, y, children }) => {
  return (
    <Group>
      <Rect
        cornerRadius={7}
        x={x}
        y={y}
        width={width}
        height={height}
        fill='#424542'
        opacity={0.7}
      />
      <Rect
        cornerRadius={7}
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={height - 4}
        fillLinearGradientColorStops={[0, '#e7dfe7', 1, '#7b757b']}
        fillLinearGradientStartPoint={{x: 0, y: 0}}
        fillLinearGradientEndPoint={{x: 0, y: height - 4}}
        opacity={0.7}
      />
      <Rect
        cornerRadius={7}
        x={x + 4}
        y={y + 4}
        width={width - 8}
        height={height - 8}
        fillLinearGradientColorStops={[0, '#04009d', 1, '#06004d']}
        fillLinearGradientStartPoint={{x: 0, y: 0}}
        fillLinearGradientEndPoint={{x: 0, y: height - 8}}
        opacity={0.7}
      />
      {children}
    </Group>
  )
}

class PlayerStats extends Component {
  static propTypes = {
    trackLength: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    players: PropTypes.array.isRequired
  }

  state = {

  }

  componentDidMount () {
    const image = new window.Image()
    image.src = powerBar
    image.onload = () => {
      this.setState({
        powerBarBackground: image
      })
    }
  }

  render () {
    const player = this.props.players[this.props.index]
    const powerBarWidth = rangeMap(player.power > 1000 ? 1000 : player.power, 0, 1000, 0, 255)

    return (
      <FF7Canvas x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
        <Text
          text={player.name}
          x={this.props.x + 14}
          y={this.props.y + 14}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={24}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Text
          text='Power'
          x={this.props.x + 229}
          y={this.props.y + 50}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={16}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Image
          fill={player.power > 1000 ? '#d54c38' : undefined}
          fillPatternImage={player.power > 1000 ? undefined : this.state.powerBarBackground}
          x={this.props.x + 229}
          y={this.props.y + 74}
          width={powerBarWidth}
          height={67}
        />
        <Text
          text={player.power}
          x={this.props.x + 228 + (player.power.toString().length === 4 ? 0 : 58)}
          y={this.props.y + 81}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={58}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Text
          text='w'
          x={this.props.x + 460}
          y={this.props.y + 111}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={24}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Text
          text={'Distance'}
          x={this.props.x + 14}
          y={this.props.y + 50}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={16}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Text
          text={player.metersRemaining}
          x={this.props.x + 14 + (player.metersRemaining.toString().length === 3 ? 0 : 58)}
          y={this.props.y + 81}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={58}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
        <Text
          text='m'
          x={this.props.x + 190}
          y={this.props.y + 111}
          fill='white'
          fontFamily='"Press Start 2P", cursive'
          fontSize={24}
          shadowColor='#424542'
          shadowOffsetX={0}
          shadowOffsetY={3}
          shadowBlur={0}
        />
      </FF7Canvas>
    )
  }
}

const mapStateToProps = ({ game: { trackLength }, players: { players } }) => ({
  trackLength: trackLength,
  players: players
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerStats)
