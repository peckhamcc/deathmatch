import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import introBackground from '../../assets/intro.png'
import FF7 from './ff7'
import styled from 'styled-components'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'

const IntroWrapper = styled.div`
  background-color: #FFF;
  background-image: url(${introBackground});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  margin: auto;
  padding-top: 500px;
`

const StartGame = FF7.extend`
  margin-top: 0;
`

class Intro extends Component {

  static propTypes = {
    onStart: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    riders: PropTypes.array.isRequired
  }

  onStart = () => {
    if (this.props.riders.length) {
      return this.props.onStart
    }

    alert('Please add some riders first!')
  }

  onReset = () => {
    if (this.props.riders.length) {
      return this.props.onReset
    }

    alert('Please add some riders first!')
  }

  render () {
    return (
      <IntroWrapper>
        <StartGame>
          <p>PCC Max Turbo</p>
          <Button onClick={this.onReset}>New Game &gt;</Button>
          <Button onClick={this.onStart}>Continue &gt;</Button>
        </StartGame>
      </IntroWrapper>
    )
  }
}

const mapStateToProps = ({ riders: { riders } }) => ({
  riders: riders
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Intro)
