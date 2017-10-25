import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import socket from '../socket'
import clubLogo from '../../assets/pcc-logo@2x.png'
import riderImages from './rider-images'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'

const Wrapper = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  background-color: #FFF;
  margin: auto;
`

const WinnerText = styled.div`
  text-align: center;
  margin: 0;
  padding: 40px 40px 20px 40px;
  font-size: 36px;
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

  p {
    font-size: 10px;
  }
  `

  const ClubLogo = styled.div`
  display: inline-block;
`

class Champion extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired
  }

  nextRace = () => {
    socket.emit('admin:game:new', this.props.adminToken)
  }

  render () {
    const champion = this.props.riders.find(rider => rider.winner)

    if (!champion) {
      return null
    }

    return (
      <Wrapper className="game-over" onClick={this.nextRace}>
        <WinnerText>{champion.name} is the champion!</WinnerText>

        <SelectedRider>
          <img
            src={riderImages[champion.gender][champion.image]}
            width='200'
            height='225'
          />
          <SelectedRiderName>{champion.name}</SelectedRiderName>
        </SelectedRider>

        <ClubLogo>
          <img src={clubLogo} height='300' />
        </ClubLogo>
      </Wrapper>
    )
  }
}

const mapStateToProps = ({ admin: { token }, riders: { riders } }) => ({
  adminToken: token,
  riders
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Champion)
