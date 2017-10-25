import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import styled from 'styled-components'
import socket from '../socket'
import clubLogo from '../../assets/pcc-logo@2x.png'
import riderImages from './rider-images'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'

const RiderContainer = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  text-align: center;
  margin: auto;
  background-color: #FFF;
`

const Riders = styled.div`
  padding: 10px;
`

const Rider = styled.div`
  color: ${props => props.selected ? 'blue' : 'black'};
  text-align: center;
  display: inline-block;
  border: 5px solid;
  border-color: ${props => {
    if (props.bike === 'A') {
      return 'red'
    }

    if (props.bike === 'B') {
      return 'blue'
    }

    if (props.eliminated) {
      return 'grey'
    }

    return 'white'
  }};
`

const SelectedRiderTitle = styled.div`
  font-size: 20px;
`

const SelectedRiderName = styled.div`
  font-size: 20px;
  width: 200px;
  line-height: 1.2;
`

const SelectedRider = styled.div`
  text-align: center;
  display: inline-block;
  padding: 10px;
  border: 5px solid;
  margin-top: 10px;
  height: 323px;
  vertical-align: top;
  border-color: ${props => {
    if (props.bike === 'A') {
      return 'red'
    }

    if (props.bike === 'B') {
      return 'blue'
    }

    return 'white'
  }};
`

const ClubLogo = styled.div`
  display: inline-block;
`

const findRider = (riders, id) => {
  let output
  
  while(!output) {
    output = riders[Math.floor(Math.random() * riders.length)]

    if (output.eliminated || output.id === id) {
      output = null
    }
  }

  return output
}

class ChooseRiders extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired,
    trackLength: PropTypes.number.isRequired
  }

  state = {
    riders: [],
    player1Index: 0,
    player2Index: 1,
    player1StartingIndex: 0,
    player2StartingIndex: 1,
    loop: 0,
    done: false,
    timeout: 100
  }

  componentWillMount () {
    this.setState({
      riders: [],
      player1Index: 0,
      player2Index: 1,
      loop: 0,
      done: false,
      timeout: 50
    })

    this.selectRiders()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  selectRiders = () => {
    if (this.state.loop === 18) {
      this.setState({
        done: true
      })

      return
    }

    const riders = this.props.riders.map(rider => {
      const r = JSON.parse(JSON.stringify(rider))
      delete r.selected
      delete r.bike

      return r
    })

    let looped = false

    const findNextIndex = (riders, lastIndex, notIndex) => {
      for (let nextIndex = lastIndex + 1; nextIndex !== lastIndex; nextIndex++) {
        if (nextIndex === riders.length) {
          nextIndex = 0
          looped = true
        }

        const rider = riders[nextIndex]

        if (!rider.eliminated && nextIndex !== notIndex) {
          return nextIndex
        }
      }

      return -1
    }

    let nextPlayer1Index = findNextIndex(riders, this.state.player1Index)

    if (this.state.loop > 10) {
      nextPlayer1Index = this.props.riders.findIndex(rider => rider.bike === 'A')
    }

    const nextPlayer2Index = findNextIndex(riders, this.state.player2Index, nextPlayer1Index)

    if (nextPlayer1Index === -1 || nextPlayer2Index === -1) {
      this.setState({
        done: true
      })

      return
    }

    const riderA = riders[nextPlayer1Index]
    const riderB = riders[nextPlayer2Index]

    riderA.selected = true
    riderA.bike = 'A'
    riderB.selected = true
    riderB.bike = 'B'

    this.setState(s => ({
      riders: riders,
      loop: looped ? s.loop + 1 : s.loop,
      player1Index: nextPlayer1Index,
      player2Index: nextPlayer2Index,
      timeout: looped ? (s.timeout > 300 ? 300 : s.timeout *= 1.1) : s.timeout
    }))

    this.timeout = setTimeout(this.selectRiders, this.state.timeout)
  }

  onStart = () => {
    socket.emit('admin:game:start', this.props.adminToken, this.props.trackLength)
  }

  onDropOut = (rider) => () => {
    if (confirm('Are you sure?')) {
      socket.emit('admin:game:rider-quit', this.props.adminToken, rider)
    }
  }

  render () {
    let riders = this.state.riders

    if (this.state.done) {
      riders = this.props.riders
    }

    const player1 = riders.find(rider => rider.bike === 'A')
    const player2 = riders.find(rider => rider.bike === 'B')

    return (
      <RiderContainer>
          <SelectedRider bike={player1.bike}>
            <SelectedRiderTitle>1P</SelectedRiderTitle>
            <img
              src={riderImages[player1.gender][player1.image]}
              width='200'
              height='225'
              onClick={this.onDropOut(player1)}
            />
            <SelectedRiderName>{player1.name}</SelectedRiderName>
          </SelectedRider>

          <ClubLogo>
            <img src={clubLogo} height='300' onClick={this.onStart} />
          </ClubLogo>

          <SelectedRider bike={player2.bike}>
            <SelectedRiderTitle>2P</SelectedRiderTitle>
            <img
              src={riderImages[player2.gender][player2.image]}
              width='200'
              height='225'
              onClick={this.onDropOut(player2)}
            />
            <SelectedRiderName>{player2.name}</SelectedRiderName>
          </SelectedRider>

          <Riders>
            {riders.map(rider => {
              return (
                <Rider key={rider.id} selected={rider.selected} bike={rider.bike} eliminated={rider.eliminated}>
                  <img
                    src={riderImages[rider.gender][rider.image]}
                    width='100'
                    height='120'
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