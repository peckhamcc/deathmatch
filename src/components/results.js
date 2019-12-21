import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Button from 'material-ui/Button'
import socket from '../socket'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import FF7 from './ff7'
import tape from '../../assets/tape.gif'
import LeaderBoard from './leader-board'

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

const NewGame = FF7.extend`
  position: absolute;
  margin: 670px 0 0 755px;
`

class Results extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired
  }

  newGame = (event) => {
    event.preventDefault()

    if (confirm('Dismiss results and start new game?')) {
      socket.emit('admin:game:intro', this.props.adminToken)
    }
  }

  render () {
    return (
      <Wrapper className="game-over" onClick={this.newGame}>
        <NewGame>
          <Button onClick={this.newGame}>Done &gt;</Button>
        </NewGame>

        <LeaderBoard />
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
)(Results)
