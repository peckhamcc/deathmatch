import React, { Component, PropTypes } from 'react'
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
    onReset: PropTypes.func.isRequired
  }

  render () {
    return (
      <IntroWrapper>
        <StartGame>
          <p>PCC Max Turbo</p>
          <Button onClick={this.props.onReset}>New Game &gt;</Button>
          <Button onClick={this.props.onStart}>Continue &gt;</Button>
        </StartGame>
      </IntroWrapper>
    )
  }
}

export default Intro