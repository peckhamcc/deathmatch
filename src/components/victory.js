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

const QUOTES = [{
  quote: 'Ride as much or as little, as long or as short as you feel. But ride.',
  saidBy: 'Eddy Merckx'
}, {
  quote: 'Don’t buy upgrades, ride up grades',
  saidBy: 'Eddy Merckx'
}, {
  quote: 'When your legs scream stop and your lungs are bursting, that\'s when it starts. That\'s the hurt locker. Winners love it in there',
  saidBy: 'Chris McCormack'
}, {
  quote: 'When my legs hurt, I say: “Shut up legs! Do what I tell you to do!',
  saidBy: 'Jens Voigt'
}, {
  quote: 'It never gets easier, you just get faster',
  saidBy: 'Greg LeMond'
}, {
  quote: 'You can’t get good by staying home. If you want to get fast, you have to go where the fast guys are',
  saidBy: 'Steve Larsen'
}, {
  quote: 'Give a man a fish and feed him for a day. Teach a man to fish and feed him for a lifetime. Teach a man to cycle and he will realise fishing is stupid and boring',
  saidBy: 'Desmond Tutu'
}, {
  quote: 'Cycling isn’t a game, it\'s a sport. Tough, hard and unpitying, and it requires great sacrifices. One plays football, or tennis, or hockey. One doesn’t play at cycling',
  saidBy: 'Jean de Gribaldy'
}, {
  quote: 'If you never confront pain, you\'re missing the essence of the sport',
  saidBy: 'Scott Martin'
}, {
  quote: 'When it\'s hurting you, that\'s when you can make a difference',
  saidBy: 'Eddy Merckx'
}, {
  quote: 'If you don\'t go for it, you definitely won\'t win',
  saidBy: 'Jens Voigt'
}, {
  quote: 'As long as I breathe, I attack',
  saidBy: 'Bernard Hinault'
}, {
  quote: 'If you brake, you don’t win',
  saidBy: 'Mario Cipollini'
}, {
  quote: 'Embrace your sweat. It is your essence and your emancipation.',
  saidBy: 'Kristin Armstrong'
}, {
  quote: 'Ride a bike. Ride a bike. Ride a bike.',
  saidBy: 'Fausto Coppi (how to improve)'
}, {
  quote: 'When you ride hard on a mountain bike, sometimes you fall, otherwise you’re not riding hard.',
  saidBy: 'George W Bush'
}, {
  quote: 'If it’s not raining, it’s not training',
  saidBy: 'Anon'
}, {
  quote: 'Training is like wrestling a bear – you don’t stop just because you’re tired',
  saidBy: 'Anon'
}, {
  quote: 'Pain is temporary, quitting lasts forever',
  saidBy: 'Lance Armstrong'
}, {
  quote: 'There\'s a terrible delight in watching a rival sink without a trace',
  saidBy: 'Bernard Hinault'
}, {
  quote: 'At cycling\'s core lies pain, hard and bitter as the pit inside a juicy peach',
  saidBy: 'Scott Martin'
}, {
  quote: 'If you can\'t crank when the crunch comes, you\'ll be left behind',
  saidBy: 'Fred Matheny'
}, {
  quote: 'I believe in pacing. I go as hard as I can, and whether I\'m leading or not I\'ll keep the same pace. So far, this has been good enough.',
  saidBy: 'Juli Furtado'
}, {
  quote: 'Running would be much better if they invented a little seat to sit on and maybe some kind of platforms for your feet to push',
  saidBy: 'Liz Hatch'
}, {
  quote: 'I get paid to hurt other people, how good is that?',
  saidBy: 'Jens Voigt'
}, {
  quote: 'Even Spartacus falls',
  saidBy: 'Rob Whitworth'
}, {
  quote: 'Thanks Jon',
  saidBy: 'Eric \'Epic\' Richardson'
}, {
  quote: 'I\'m at home',
  saidBy: 'Ben Rogers'
}, {
  quote: 'United We Roll. Except if you\'re being timed.',
  saidBy: 'Alex Potsides'
}, {
  quote: 'I haven\'t been this proud since I got my 10m puffin swimming badge',
  saidBy: 'Fran Evans'
}, {
  quote: 'Stop whinging and have a gel',
  saidBy: 'Alex Potsides'
}, {
  quote: 'Complaining is just wasted watts',
  saidBy: 'Alex Potsides'
}, {
  quote: 'It\'s just a few 50km rides back to back...',
  saidBy: 'Eric \'Epic\' Richardson'
}, {
  quote: 'Better brakes? Why would I spend money on something that makes me slower?',
  saidBy: 'Jon Armstrong'
}, {
  quote: 'The less time we are stationary the slower we can ride while moving',
  saidBy: 'Eric \'Epic\' Richardson'
}, {
  quote: 'The only thing I know for sure is that I\'m peddling. Besides that I\'ve not a clue what’s going on',
  saidBy: 'Gerard Ward'
}, {
  quote: 'F*ck this I\'m joining Dulwich Paragon',
  saidBy: 'Paul Schneider'
}, {
  quote: 'I dont think I\'d ever class myself as 100% in control of my bike 😅',
  saidBy: 'Leo Hemsted'
}, {
  quote: 'Is the carbon necessary?',
  saidBy: 'Amy Powell'
}]

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

const Riders = styled.div`
  padding: 20px;
  text-align: center;
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
  padding-top: 30px;
`

const Quote = styled.div`
  font-size: 24px;
  padding: 40px 80px 20px 80px;
  line-height: 1.4;
  text-align: center;
`

const AttributedTo = styled.div`
  font-size: 18px;
  padding: 10px 80px;
  text-align: center;
`

const NextRace = styled(FF7)`
  position: absolute;
  margin: 670px 0 0 755px;
`

class Victory extends Component {

  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    riders: PropTypes.array.isRequired,
    freeplay: PropTypes.bool.isRequired
  }

  nextRace = () => {
    socket.emit('admin:game:continue', this.props.adminToken)
  }

  render () {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const player1 = this.props.riders.find(rider => rider.bike === 'A')
    const player2 = this.props.riders.find(rider => rider.bike === 'B')

    return (
      <Wrapper className="game-over" onClick={this.nextRace}>
        <NextRace>
            <Button onClick={this.nextRace}>Next Race &gt;</Button>
        </NextRace>
        <WinnerText>{(player1.winner ? player1 : player2).name} Wins!</WinnerText>
        <Riders>
         <SelectedRider bike={player1.bike}>
            <SelectedRiderTitle>1P</SelectedRiderTitle>
            <img
              src={(player1.winner ? player1.photoWin : player1.photoLose) || riderImages[player1.gender][player1.image]}
              width='200'
              height='225'
            />
            <SelectedRiderName>{player1.name}</SelectedRiderName>
          </SelectedRider>

          <ClubLogo>
            <img src={clubLogo} height='300' />
          </ClubLogo>

          <SelectedRider bike={player2.bike}>
            <SelectedRiderTitle>2P</SelectedRiderTitle>
            <img
              src={(player2.winner ? player2.photoWin : player2.photoLose) || riderImages[player2.gender][player2.image]}
              width='200'
              height='225'
            />
            <SelectedRiderName>{player2.name}</SelectedRiderName>
          </SelectedRider>
        </Riders>

        <Quote>&quot;{quote.quote}&quot;</Quote>
        <AttributedTo>- {quote.saidBy} -</AttributedTo>
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
)(Victory)
