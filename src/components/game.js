import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layer, Rect, Stage, Group } from 'react-konva'
import styled from 'styled-components'
import Background from './background'
import Road from './road'
import Player from './player'
import PlayerStats from './player-stats'
import CountDown from './count-down'
import SprintMessage from './sprint-message'
import GAME_STATE from '../constants/game-state'
import FinishLine from './finish-line'
import Sky from './sky'
import backgroundClouds from '../../assets/background-clouds.png'
import backgroundCity from '../../assets/background-city.png'
import backgroundTerraces from '../../assets/background-terraces.png'
import backgroundPeckham from '../../assets/background-peckham.png'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import riderASprite from '../../assets/rider-a-sprite.png'
import riderBSprite from '../../assets/rider-b-sprite.png'
import riderASpotlight from '../../assets/rider-a-spotlight.png'
import riderBSpotlight from '../../assets/rider-b-spotlight.png'
import Spotlight from './spotlight'
import Screen from './screen'

const StageWrapper = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  background-color: #FFF;
  margin: auto;
`

const RIDER_SPRITES = [
  riderASprite,
  riderBSprite
]

const SPOTLIGHT_SPRITES = [
  riderASpotlight,
  riderBSpotlight
]

class Game extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    players: PropTypes.array.isRequired
  }

  state = {
    canvas: null
  }

  requestFullScreen = () => {
    if (!this.canvas) {
      return
    }

    this.canvas.getCanvas().webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  }

  render () {
    return (
      <StageWrapper>
        <Stage
          width={this.props.width}
          height={this.props.height}
          ref={ref => this.canvas = ref}
          >
          <Layer>
            <Sky />
            <Background image={backgroundClouds} width={4096} height={200} speed={2} y={60} />
            <Background image={backgroundCity} width={4096} height={451} speed={4} y={25} />
            <Background image={backgroundTerraces} width={6144} height={306} speed={6} y={334} />
            <Background image={backgroundPeckham} width={8192} height={400} speed={8} y={240} />
            <Screen />
            <Road y={640} />
            <FinishLine y={640} />
            {
              this.props.players.map((player, index) => (
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
                    sprite={RIDER_SPRITES[index]}
                    x={player.x}
                  />
                </Group>
              ))
            }
            {
              this.props.gameState !== GAME_STATE.countingDown && this.props.players.map((player, index) => (
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
            <Rect
              ref={ref => ref && ref.on('click', this.requestFullScreen)}
              x={0}
              y={758}
              width={10}
              height={10}
            />
            { this.props.gameState === GAME_STATE.countingDown && <CountDown /> }
            { this.props.gameState === GAME_STATE.sprint && <SprintMessage /> }
          </Layer>
        </Stage>
      </StageWrapper>
    )
  }
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
