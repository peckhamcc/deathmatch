import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image } from 'react-konva'
import finishLineImage from '../../assets/finish-line.png'
import { addAnimateable, removeAnimateable } from './animator'
import GAME_STATE from '../constants/game-state'
import assets from '../css/assets'

class FinshLine extends Component {

  static propTypes = {
    gameState: PropTypes.string.isRequired
  }

  state = {
    xOffset: 0
  }

  componentDidMount () {
    addAnimateable(this.animate)

    this.setState({
      xOffset: 0
    })
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  animate = () => {
    if (this.props.gameState !== GAME_STATE.finishing) {
      return
    }

    this.setState(s => {
      return {
        xOffset: s.xOffset - 12
      }
    })
  }

  render () {
    return (
      <Image
        image={assets.get(finishLineImage)}
        x={0 + this.state.xOffset}
        y={640}
        width={1152}
        height={128}
      />
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
)(FinshLine)
