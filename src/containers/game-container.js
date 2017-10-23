import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GAME_STATE from '../constants/game-state'
import { Game, Intro, Victory, Connecting, ChooseRiders, Champion } from '../components'
import debug from 'debug'
import { connect } from 'react-redux'
import { updateGameState } from '../store/actions'
import socket from '../socket'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'

const log = debug('GameContainer')

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

  render () {
    if (this.props.gameState === GAME_STATE.intro) {
      return (
        <Intro
          onStart={this.continueGame}
          onReset={this.newGame}
        />
      )
    }

    if (this.props.gameState === GAME_STATE.riders) {
      return <ChooseRiders />
    }

    if (this.props.gameState === GAME_STATE.countingDown || 
      this.props.gameState === GAME_STATE.race ||
      this.props.gameState === GAME_STATE.finishing) {
      return <Game width={STAGE_WIDTH} height={STAGE_HEIGHT} />
    }

    if (this.props.gameState === GAME_STATE.finished) {
      return  <Victory />
    }

    if (this.props.gameState === GAME_STATE.done) {
      return <Champion />
    }

   return <Connecting />
  }
}

const mapStateToProps = ({ admin: { token }, game: { state } }) => ({
  adminToken: token,
  gameState: state
})

const mapDispatchToProps = {
  updateGameState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameContainer)
