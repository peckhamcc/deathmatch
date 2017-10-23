import React, { Component, PropTypes } from 'react'
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
  width: 200px;
  text-overflow: ellipsis;
`

const SelectedRiderName = styled.div`
  font-size: 20px;
  width: 200px;
  text-overflow: ellipsis;
  line-height: 1.2;
`

const SelectedRider = styled.div`
  color: ${props => props.selected ? 'blue' : 'black'};
  text-align: center;
  display: inline-block;
  padding: 10px;
  border: 5px solid;
  margin-top: 10px;
  height: 323px;
  border-color: ${props => {
    if (props.bike === 'A') {
      return 'red'
    }

    if (props.bike === 'B') {
      return 'blue'
    }

    return 'white'
  }};

  p {
    font-size: 10px;
  }
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
    showRiders: false,
    count: 0,
    timeout: 10
  }

  componentWillMount () {
    this.setState({
      showRiders: false,
      count: 0,
      timeout: 50
    })

    this.selectRandomRiders()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  selectRandomRiders = () => {
    if (this.state.count === 20) {
      this.setState({
        showRiders: true
      })

      return
    }

    const riders = this.props.riders.map(rider => {
      const r = JSON.parse(JSON.stringify(rider))
      delete r.selected
      delete r.bike

      return r
    })

    const player1 = findRider(riders)
    const player2 = findRider(riders, player1.id)
  
    player1.selected = true
    player1.bike = 'A'
    player2.selected = true
    player2.bike = 'B'

    this.setState(s => ({
      riders: riders,
      showRiders: false,
      count: s.count + 1,
      timeout: s.timeout < 500 ? Math.round(s.timeout * 1.2) : s.timeout
    }))

    this.timeout = setTimeout(this.selectRandomRiders, this.state.timeout)
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

    if (this.state.showRiders) {
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