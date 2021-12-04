import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import riderImages from './rider-images.js'

const Header = styled.div`
  font-size: 18px;
  margin: 10px;
  margin-top: 0;
  padding-top: 10px;
`

const Table = styled.table`
  font-size: 16px;
  border-spacing: 5px;
`

const TableHeader = styled.th`
  padding: 10px;
  background-color: #EEE;
  border: 1px solid #333;
  font-size: 12px;
`

const TableCell = styled.td`
  padding: 10px;
  background-color: #FFF;
  font-size: 12px;
`

const SmallTableCell = styled(TableCell)`
  width: 66px;
`

const findRider = (riders, id) => {
  return riders.filter(rider => rider.id === id).pop()
}

const findLeaderboardEntry = (riders, entry) => {
  if (!entry) {
    return {
      rider: {
        name: '-'
      },
      value: '-'
    }
  }

  const rider = findRider(riders, entry.player)

  if (!rider) {
    return {
      rider: {
        name: '-'
      },
      value: '-'
    }
  }

  return {
    rider,
    value: entry.value + 'w'
  }
}

const RiderImage = ({ rider: { photoWin, gender, image } }) => {
  if (!gender) {
    return null
  }

  return (
    <img
      src={photoWin || riderImages[gender][image]}
      width='52'
      height='64'
    />
  )
}

const findWinner = (riders, gender) => {
  const winner = riders
    .filter(rider => rider.gender === gender)
    .filter(rider => rider.winner)
    .pop()

  return winner || riders
    .filter(rider => rider.gender === gender)
    .sort((a, b) => a.eliminatedAt - b.eliminatedAt)
    .pop()
}

const LeaderBoard = ({ riders, power, cadence, joules, speed }) => {
  const leaderBoard = []

  for (let i = 0; i < 5; i++) {
    leaderBoard.push({
      power: {
        male: findLeaderboardEntry(riders, power.male[i]),
        female: findLeaderboardEntry(riders, power.female[i])
      },
      speed: {
        male: findLeaderboardEntry(riders, speed.male[i]),
        female: findLeaderboardEntry(riders, speed.female[i])
      }
    })
  }

  const mensChampion = findWinner(riders, 'male')
  const womensChampion = findWinner(riders, 'female')

  return (
    <div>
      <Header>Overall</Header>
      <Table width='100%'>
        <thead>
          <tr>
            <TableHeader colSpan='2' width='50%'>Men</TableHeader>
            <TableHeader colSpan='2' width='50%'>Women</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <SmallTableCell><RiderImage rider={mensChampion} /></SmallTableCell>
            <TableCell>{mensChampion.name}</TableCell>
            <SmallTableCell><RiderImage rider={womensChampion} /></SmallTableCell>
            <TableCell>{womensChampion.name}</TableCell>
          </tr>
        </tbody>
      </Table>
      <Header>Power</Header>
      <Table width='100%'>
        <thead>
          <tr>
            <TableHeader colSpan='3' width='50%'>Men</TableHeader>
            <TableHeader colSpan='3' width='50%'>Women</TableHeader>
          </tr>
        </thead>
        <tbody>
          {
            leaderBoard.map((leaders, index) => (
              <tr key={index}>
                <SmallTableCell><RiderImage rider={leaders.power.male.rider} /></SmallTableCell>
                <TableCell>{leaders.power.male.rider.name}</TableCell>
                <SmallTableCell>{leaders.power.male.value}</SmallTableCell>

                <SmallTableCell><RiderImage rider={leaders.power.female.rider} /></SmallTableCell>
                <TableCell>{leaders.power.female.rider.name}</TableCell>
                <SmallTableCell>{leaders.power.female.value}</SmallTableCell>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  )
}

const mapStateToProps = ({ leaderboard: { power, cadence, joules, speed }, riders: { riders } }) => ({
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
