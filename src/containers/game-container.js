import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GAME_STATE from '../constants/game-state.js'
import {
  Game,
  Intro,
  Victory,
  Connecting,
  SelectingRiders,
  ChooseRiders,
  Champion,
  Results,
  LoadingAssets
} from '../components/index.js'
import { connect } from 'react-redux'
import { updateGameState } from '../store/actions/index.js'
import socket from '../socket/index.js'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings.js'

class GameContainer extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    gameState: PropTypes.string.isRequired
  }

  newGame = () => {
    socket.emit('admin:game:new', this.props.adminToken)
  }

  continueGame = () => {
    socket.emit('admin:game:continue', this.props.adminToken)
  }

  onFreePlay = () => {
    socket.emit('admin:game:freeplay', this.props.adminToken)
  }

  render () {
    if (this.props.gameState === GAME_STATE.loading) {
      return (
        <LoadingAssets />
      )
    }

    if (this.props.gameState === GAME_STATE.intro) {
      return (
        <Intro
          onStart={this.continueGame}
          onReset={this.newGame}
          onFreePlay={this.onFreePlay}
        />
      )
    }

    if (this.props.gameState === GAME_STATE.riders) {
      if (this.props.freeplay) {
        return <ChooseRiders />
      } else {
        return <SelectingRiders />
      }
    }

    if (this.props.gameState === GAME_STATE.countingDown ||
      this.props.gameState === GAME_STATE.race ||
      this.props.gameState === GAME_STATE.sprint ||
      this.props.gameState === GAME_STATE.finishing) {
      return <Game width={STAGE_WIDTH} height={STAGE_HEIGHT} />
    }

    if (this.props.gameState === GAME_STATE.finished) {
      return  <Victory />
    }

    if (this.props.gameState === GAME_STATE.done) {
      return <Champion />
    }

    if (this.props.gameState === GAME_STATE.results) {
      return <Results />
    }

   return <Connecting />
  }
}

const mapStateToProps = ({ admin: { token }, game: { state, freeplay } }) => ({
  adminToken: token,
  gameState: state,
  freeplay: freeplay
})

const mapDispatchToProps = {
  updateGameState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameContainer)
