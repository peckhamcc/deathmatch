import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button } from '@mui/material'
import socket from '../socket/index.js'
import clubLogo from '../../assets/pcc-logo@2x.png'
import riderImages from './rider-images.js'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings.js'
import FF7 from './ff7.js'
import tape from '../../assets/tape.gif'

const Wrapper = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  background-color: #FFF;
  background-image: url('${tape}');
  background-size: cover;
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
  text-overflow: ellipsis;
  line-height: 1.2;
`

const SelectedRider = styled.div`
  color: ${props => props.selected ? 'blue' : 'black'};
  text-align: center;
  display: inline-block;
  padding: 10px;
  margin: 50px;
  vertical-align: top;
`

const ClubLogo = styled.div`
  display: inline-block;
  padding-top: 140px;
`

const NewGame = styled(FF7)`
  position: absolute;
  margin: 670px 0 0 755px;
`

class Champion extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired,
    freeplay: PropTypes.bool.isRequired,
  }

  showResults = () => {
    if (this.props.freeplay) {
      socket.emit('admin:game:intro', this.props.adminToken)
    } else {
      socket.emit('admin:game:results', this.props.adminToken)
    }
  }

  render () {
    const champion = this.props.riders.find(rider => rider.winner)

    if (!champion) {
      return null
    }

    return (
      <Wrapper className="game-over" onClick={this.newGame}>
        <NewGame>
          <Button onClick={this.showResults}>{this.props.freeplay ? 'Results' : 'Done'} &gt;</Button>
        </NewGame>

        <WinnerText>{champion.name} wins!</WinnerText>

        <SelectedRider>
          <img
            src={champion.photoWin || riderImages[champion.gender][champion.image]}
            width='400'
            height='450'
          />
        </SelectedRider>

        <ClubLogo>
          <img src={clubLogo} height='300' />
        </ClubLogo>

      </Wrapper>
    )
  }
}

const mapStateToProps = ({ admin: { token }, riders: { riders }, game: { freeplay } }) => ({
  adminToken: token,
  riders,
  freeplay
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Champion)
