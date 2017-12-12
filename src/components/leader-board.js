import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

const Header = styled.div`
  font-size: 18px;
`

const Table = styled.table`
  font-size: 16px;
`

const TableCell = styled.td`
  width: 12.5%;
`

const findRider = (riders, id) => {
  return riders.filter(rider => rider.id === id).pop()
}

const findLeaderboardEntry = (riders, entry) => {
  if (!entry) {
    return {
      name: '-',
      value: '-'
    }
  }

  const rider = findRider(riders, entry.player)

  if (!rider) {
    return {
      name: '-',
      value: '-'
    }
  }

  return {
    name: rider.name,
    value: entry.value
  }
}

const LeaderBoard = ({ riders, power, cadence, joules, speed }) => {
  const leaderBoard = []

  for(let i = 0; i < 5; i++) {
    leaderBoard.push({
      power: {
        male: findLeaderboardEntry(riders, power.male[i]),
        female: findLeaderboardEntry(riders, power.female[i]),
      },
      speed: {
        male: findLeaderboardEntry(riders, speed.male[i]),
        female: findLeaderboardEntry(riders, speed.female[i]),
      }
    })
  }

  return (
    <div>
      <Header>Leaderboard</Header>
      <Table>
        <tr>
          <th colSpan='4'>Power</th>
          <th colSpan='4'>Speed</th>
        </tr>
        <tr>
          <th colSpan='2'>Men</th>
          <th colSpan='2'>Women</th>
          <th colSpan='2'>Men</th>
          <th colSpan='2'>Women</th>
        </tr>
        {
          leaderBoard.map((leaders, index) => (
            <tr key={index}>
              <TableCell>{leaders.power.male.name}</TableCell>
              <TableCell>{leaders.power.male.value} w</TableCell>

              <TableCell>{leaders.power.female.name}</TableCell>
              <TableCell>{leaders.power.female.value} w</TableCell>

              <TableCell>{leaders.speed.male.name}</TableCell>
              <TableCell>{leaders.speed.male.value} kph</TableCell>

              <TableCell>{leaders.speed.female.name}</TableCell>
              <TableCell>{leaders.speed.female.value} kph</TableCell>
            </tr>
          ))
        }
      </Table>
    </div>
  )
}

const mapStateToProps = ({ leaderboard: { power, cadence, joules, speed }, riders: { riders }}) => ({
  riders,
  power,
  cadence,
  joules,
  speed
})

const mapDispatchToProps = {
  
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaderBoard)
