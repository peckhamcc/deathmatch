import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layer, Rect, Stage, Group, Text } from 'react-konva'
import FF7 from './ff7'
import GAME_STATE from '../constants/game-state'

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

const PlayerStats = ({trackLength, x, y, width, height, index, players}) => {
  const player = players[index]

  let powerColour = 'white'

  if (player.power > 400) {
    powerColour = 'yellow'
  }

  if (player.power > 800) {
    powerColour = 'red'
  }

  const wattsPerKg = (player.power / player.weight).toFixed(2)

  let wattsPerKgColour = 'white'

  if (wattsPerKg > 4) {
    wattsPerKgColour = 'yellow'
  }

  if (wattsPerKg > 6) {
    wattsPerKgColour = 'red'
  }

  let cadenceColour = 'white'

  if (player.cadence > 100) {
    cadenceColour = 'yellow'
  }

  if (player.cadence > 120) {
    cadenceColour = 'red'
  }

  const power = '1000'

  return (
    <FF7Canvas x={x} y={y} width={width} height={height}>
      <Text
        text={player.name}
        x={x + 14}
        y={y + 14}
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
        x={x + 202}
        y={y + 48}
        fill={powerColour}
        fontFamily='"Press Start 2P", cursive'
        fontSize={16}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />
      <Text
        text={player.power}
        x={x + 202 + (player.power.toString().length === 4 ? 0 : 64)}
        y={y + 74}
        fill={powerColour}
        fontFamily='"Press Start 2P", cursive'
        fontSize={64}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />
      <Text
        text='w'
        x={x + 460}
        y={y + 109}
        fill={powerColour}
        fontFamily='"Press Start 2P", cursive'
        fontSize={24}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />
      {/*<Text
        text={`Power to weight: ${wattsPerKg} w/kg`}
        x={x + 14}
        y={y + 74}
        fill={wattsPerKgColour}
        fontFamily='"Press Start 2P", cursive'
        fontSize={16}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />
      <Text
        text={`Cadence: ${player.cadence} rpm`}
        x={x + 14}
        y={y + 98}
        fill={cadenceColour}
        fontFamily='"Press Start 2P", cursive'
        fontSize={16}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />*/}
      <Text
        text={'Remaining'}
        x={x + 14}
        y={y + 48}
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
        x={x + 14}
        y={y + 74}
        fill='white'
        fontFamily='"Press Start 2P", cursive'
        fontSize={64}
        shadowColor='#424542'
        shadowOffsetX={0}
        shadowOffsetY={3}
        shadowBlur={0}
      />
    </FF7Canvas>
  )
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
