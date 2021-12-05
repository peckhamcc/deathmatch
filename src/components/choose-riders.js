import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from '@mui/material'
import styled from 'styled-components'
import socket from '../socket/index.js'
import clubLogo from '../../assets/pcc-logo@2x.png'
import riderImages from './rider-images.js'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings.js'
import FF7 from './ff7.js'
import player1Outline from '../../assets/player1-outline.png'
import player2Outline from '../../assets/player2-outline.png'

const RiderContainer = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  text-align: center;
  margin: auto;
  background-color: #FFF;
`

const Riders = styled.div`
  padding: 10px;
  margin-top: 20px;
`

const Rider = styled.div`
  color: ${props => props.selected ? 'blue' : 'black'};
  text-align: center;
  display: inline-block;
  border: 5px solid;
  border-color: ${props => {
    if (props.bike === 'A') {
      return '#ea3423'
    }

    if (props.bike === 'B') {
      return '#2354b3'
    }

    return 'white'
  }};

  img {
    filter: ${props => {
      if (props.eliminated) {
        return 'grayscale(100%)'
      }

      return 'none'
    }};
  }
`

const PlayerOutline = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`

const SelectedRiderName = styled.div`
  font-size: 20px;
  line-height: 1.2;
  width: 200px;
  margin-left: 26px;
  text-overflow: ellipsis;
  height: 50px;
  overflow: hidden;
`

const SelectedRider = styled.div`
  text-align: center;
  display: inline-block;
  margin-top: 10px;
  height: 323px;
  width: 254px;
  vertical-align: top;
  position: relative;
`

const SelectedRiderImage = styled.img`
  margin: 26px 0 10px 0;
`

const ClubLogo = styled.div`
  display: inline-block;
  margin-top: 30px;
`

const StartRace = styled(FF7)`
  position: absolute;
  margin: 670px 0 0 755px;
`

const Back = styled(FF7)`
  position: absolute;
  margin: 670px 0 0 20px;
`

class ChooseRiders extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired,
    trackLength: PropTypes.number.isRequired
  }

  state = {
    player1Index: 0,
    player2Index: 1,
    selectIndex: 1
  }

  UNSAFE_componentWillMount () {
    this.setState({
      player1Index: 0,
      player2Index: 1
    })
  }

  onStart = () => {
    socket.emit(
      'admin:game:freeplay:start',
      this.props.adminToken,
      this.props.trackLength, [
        this.state.player1Index,
        this.state.player2Index
      ].map(index => this.props.riders[index].id)
    )
  }

  onBack = () => {
    socket.emit('admin:game:intro', this.props.adminToken)
  }

  selectRider = (index) => {
    return () => {
      this.setState((s => {
        return {
          [`player${s.selectIndex}Index`]: index
        }
      }))
    }
  }

  setSelectIndex = (index) => {
    return () => {
      this.setState({
        selectIndex: index
      })
    }
  }

  render () {
    let riders = this.props.riders

    const player1 = riders[this.state.player1Index]
    const player2 = riders[this.state.player2Index]

    return (
      <RiderContainer>
          <StartRace>
            <Button onClick={this.onStart}>Start Race &gt;</Button>
          </StartRace>
          <Back>
            <Button onClick={this.onBack}>&lt; Abort!</Button>
          </Back>
          <SelectedRider bike={player1.bike} onClick={this.setSelectIndex(1)}>
            <PlayerOutline src={player1Outline} width='254' height='338' />
            <SelectedRiderImage
              src={player1.photoSelect || riderImages[player1.gender][player1.image]}
              width='200'
              height='225'
            />
            <SelectedRiderName>{player1.name}</SelectedRiderName>
          </SelectedRider>

          <ClubLogo>
            <img src={clubLogo} height='300' onClick={this.onStart} />
          </ClubLogo>

          <SelectedRider bike={player2.bike} onClick={this.setSelectIndex(2)}>
            <PlayerOutline src={player2Outline} width='253' height='338' />
            <SelectedRiderImage
              src={player2.photoSelect || riderImages[player2.gender][player2.image]}
              width='200'
              height='225'
            />
            <SelectedRiderName>{player2.name}</SelectedRiderName>
          </SelectedRider>

          <Riders>
            {riders.map((rider, index) => {
              return (
                <Rider key={rider.id} selected={rider.selected} bike={rider.bike}>
                  <img
                    src={rider.photoSelect}
                    width='100'
                    height='120'
                    onClick={this.selectRider(index)}
                  />
                </Rider>
              )
            })}
          </Riders>
      </RiderContainer>
    )
  }
}

const mapStateToProps = ({ admin: { token }, riders: { riders }, game: { trackLength } }) => ({
  adminToken: token,
  riders: riders,
  trackLength: trackLength
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseRiders)