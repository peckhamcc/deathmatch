import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@mui/material/Button/index.js'
import styled from 'styled-components'
import socket from '../socket/index.js'
import clubLogo from '../../assets/pcc-logo@2x.png'
import riderImages from './rider-images.js'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings.js'
import FF7 from './ff7.js'
import player1Outline from '../../assets/player1-outline.png'
import player2Outline from '../../assets/player2-outline.png'
import PLAYER_LETTERS from '../constants/player-letters.js'

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

// how many times we should select a rider
const NUM_SELECTS = 30

// how many times to select after the previous rider is selected
const SELECT_INCREMENT = 10

class SelectingRiders extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired,
    trackLength: PropTypes.number.isRequired
  }

  state = {
    riders: [],
    selected: [],
    done: false,
    timeout: 50
  }

  componentWillMount () {
    this.setupSelectRiders(this.props)
  }

  // gets called after mounting if we are being reused
  componentWillReceiveProps (nextProps) {
    this.setupSelectRiders(nextProps)
  }

  setupSelectRiders (props) {
    clearTimeout(this.selectRidersTimeout)
    clearTimeout(this.selectRidersImmediate)

    let selected = []

    const riders = props.riders.map((rider, index) => {
      if (rider.selected) {
        console.info('rider', rider.name, 'was selected for bike', rider.bike, 'at index', index)

        let steps = NUM_SELECTS + (SELECT_INCREMENT * PLAYER_LETTERS.indexOf(rider.bike))
        let startPosition = index - steps

        while (startPosition < 0) {
          startPosition += props.riders.length
        }

        selected.push({
          bike: rider.bike,
          index: startPosition,
          finish: index,
          selects: steps
        })
      }

      const r = JSON.parse(JSON.stringify(rider))
      delete r.selected
      delete r.bike

      return r
    })

    selected = selected.sort((a, b) => a.bike.localeCompare(b.bike))

    selected.forEach((selected) => {
      const rider = riders[selected.finish]
      console.info('rider', rider.name, 'was selected for bike', selected.bike, 'start index',  selected.index, 'end index', selected.finish, 'in', selected.selects, 'selects')
    })

    this.setState({
      riders,
      selected,
      done: false,
      timeout: 50
    })

    this.selectRidersImmediate = setTimeout(this.selectRiders, 0)
  }

  componentWillUnmount () {
    clearTimeout(this.selectRidersTimeout)
    clearTimeout(this.selectRidersImmediate)
  }

  selectRiders = () => {
    const {
      selected
    } = this.state

    const riders = this.props.riders.map((rider) => {
      const r = JSON.parse(JSON.stringify(rider))
      delete r.selected
      delete r.bike

      return r
    })

    let willContinue = false

    const selectRider = (rider, selected) => {
      /*if (rider.eliminated) {
        selected.index++
        selected.selects--

        if (selected.index === this.props.riders.length) {
          selected.index = 0
        }

        rider = riders[selected.index]

        return selectRider(rider, selected)
      }
*/
      rider.selected = true
      rider.bike = selected.bike

      console.info('rider', rider.bike, 'is index', selected.index, rider.name, 'selects left', selected.selects)

      if (selected.selects > 0) {
        willContinue = true
        selected.selects--
        selected.index++

        if (selected.index === this.props.riders.length) {
          selected.index = 0
        }
      }
    }

    selected.forEach(selected => {
      selectRider(riders[selected.index], selected)
    })

    this.setState(() => ({
      riders: riders,
      timeout: this.state.timeout += 10,
      selected: selected
    }))

    if (willContinue) {
      this.selectRidersTimeout = setTimeout(this.selectRiders, this.state.timeout)
    } else {
      this.setState({
        done: true
      })
    }
  }

  onStart = () => {
    socket.emit('admin:game:start', this.props.adminToken, this.props.trackLength)
  }

  onBack = () => {
    socket.emit('admin:game:intro', this.props.adminToken)
  }

  onDropOut = (rider) => () => {
    if (confirm(`${rider.name} dropped out, remove them from the game?`)) {
      socket.emit('admin:game:rider-quit', this.props.adminToken, rider)
    }
  }

  render () {
    const {
      done,
      selected
    } = this.state

    const riders = done ? this.props.riders : this.state.riders
    const player1 = riders[selected.find(rider => rider.bike === 'A').index]
    const player2 = riders[selected.find(rider => rider.bike === 'B').index]

    return (
      <RiderContainer>
          <StartRace>
            <Button onClick={this.onStart}>Start Race &gt;</Button>
          </StartRace>
          <Back>
            <Button onClick={this.onBack}>&lt; Abort!</Button>
          </Back>
          <SelectedRider bike={player1.bike} onClick={this.onDropOut(player1)}>
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

          <SelectedRider bike={player2.bike} onClick={this.onDropOut(player2)}>
            <PlayerOutline src={player2Outline} width='253' height='338' />
            <SelectedRiderImage
              src={player2.photoSelect || riderImages[player2.gender][player2.image]}
              width='200'
              height='225'
            />
            <SelectedRiderName>{player2.name}</SelectedRiderName>
          </SelectedRider>

          <Riders>
            {riders.map(rider => {
              return (
                <Rider key={rider.id} selected={rider.selected} bike={rider.bike} eliminated={rider.eliminated}>
                  <img
                    src={rider.eliminated ? rider.photoLose : rider.photoSelect}
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
)(SelectingRiders)
