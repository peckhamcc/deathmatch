import React from 'react'
import { connect, Provider, useStore } from 'react-redux'
import { Group } from 'react-konva'
import Background from './background.js'
import Road from './road.js'
import Player from './player.js'
import PlayerStats from './player-stats.js'
import CountDown from './count-down.js'
import SprintMessage from './sprint-message.js'
import GAME_STATE from '../constants/game-state.js'
import FinishLine from './finish-line.js'
import Sky from './sky.js'
import backgroundClouds from '../../assets/background-clouds.png'
import backgroundCity from '../../assets/background-city.png'
import backgroundTerraces from '../../assets/background-terraces.png'
import backgroundPeckham from '../../assets/background-peckham.png'
import riderAMSprite from '../../assets/rider-a-m-sprite.png'
import riderAFSprite from '../../assets/rider-a-f-sprite.png'
import riderBMSprite from '../../assets/rider-b-m-sprite.png'
import riderBFSprite from '../../assets/rider-b-f-sprite.png'
import riderASpotlight from '../../assets/rider-a-spotlight.png'
import riderBSpotlight from '../../assets/rider-b-spotlight.png'
import Spotlight from './spotlight.js'
import Screen from './screen.js'
import Canvas from './canvas.js'

const RIDER_SPRITES = {
  female: [
    riderAFSprite,
    riderBFSprite
  ],
  male: [
    riderAMSprite,
    riderBMSprite
  ]
}

const SPOTLIGHT_SPRITES = [
  riderASpotlight,
  riderBSpotlight
]

function Game ({ width, height, players, gameState }) {
  // context doesn't work inside react-konva any more
  // https://github.com/konvajs/react-konva/issues/349
  const store = useStore()
console.info(players)
  return (
    <Canvas
      width={width}
      height={height}
      >
      <Provider store={store}>
        <Sky />
        <Background image={backgroundClouds} width={4096} height={200} speed={2} y={60} />
        <Background image={backgroundCity} width={4096} height={451} speed={4} y={25} />
        <Background image={backgroundTerraces} width={6144} height={306} speed={6} y={334} />
        <Background image={backgroundPeckham} width={8192} height={400} speed={8} y={240} />
        <Screen />
        <Road y={640} />
        <FinishLine y={640} />
        {
          players.map((player, index) => (
            <Group key={player.id}>
              <Spotlight
                index={index}
                yOffset={index === 0 ? -50 : 0}
                sprite={SPOTLIGHT_SPRITES[index]}
                status={player.status}
              />
              <Player
                index={index}
                player={player}
                yOffset={index === 0 ? 250 : 300}
                xOffset={index === 0 ? 50 : 0}
                sprite={RIDER_SPRITES[player.gender][index]}
                x={player.x}
              />
            </Group>
          ))
        }
        {
          gameState !== GAME_STATE.countingDown && players.map((player, index) => (
            <PlayerStats
              x={index === 0 ? 10 : 519}
              y={10}
              width={495}
              height={154}
              index={index}
              key={player.id}
            />
          ))
        }
        { gameState === GAME_STATE.countingDown && <CountDown /> }
        { gameState === GAME_STATE.sprint && <SprintMessage /> }
      </Provider>
    </Canvas>
  )
}

const mapStateToProps = ({ game: { state }, players: { players } }) => ({
  players: players,
  gameState: state
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
