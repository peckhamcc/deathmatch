import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@mui/styles/index.js'
import TextField from '@mui/material/TextField/index.js'
import Select from '@mui/material/Select/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'
import {
  setAdminToken,
  setNumPlayers,
  setTrackLength
} from '../../store/actions/index.js'
import socket from '../../socket/index.js'

const styles = {

}

class Game extends Component {
  state = {
    numPlayers: 2,
    password: '',
    trackLength: 400
  }

  componentDidMount () {
    this.setState({
      numPlayers: this.props.numPlayers,
      password: this.props.password,
      trackLength: this.props.trackLength
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })

    if (name === 'numPlayers') {
      this.props.setNumPlayers(event.target.value)
      socket.emit('admin:game:set-num-players', this.state.password, event.target.value)
    } else if (name === 'password') {
      this.props.setAdminToken(event.target.value)
    } else if (name === 'trackLength') {
      const trackLength = parseInt(event.target.value, 10)
      this.props.setTrackLength(trackLength)
      socket.emit('admin:game:set-track-length', this.state.password, trackLength)
    }
  }

  render () {
    return (
      <div>
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          onChange={this.handleChange('password')}
          value={this.state.password}
        />
        <br />
        <Select
            value={this.state.numPlayers}
            onChange={this.handleChange('numPlayers')}
            inputProps={{
              name: 'num-players',
              id: 'num-players',
            }}
          >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
        <br />
        <TextField
          id="trackLength"
          label="Track length"
          margin="normal"
          onChange={this.handleChange('trackLength')}
          value={this.state.trackLength}
          type="number"
        />
      </div>
    )
  }
}

Game.propTypes = {
  numPlayers: PropTypes.number.isRequired,
  trackLength: PropTypes.number,
  password: PropTypes.string
}

const mapStateToProps = ({ game: { numPlayers, trackLength }, admin: { token } }) => {
  return {
    numPlayers,
    trackLength,
    password: token
  }
}

const mapDispatchToProps = {
  setAdminToken,
  setNumPlayers,
  setTrackLength
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Game))
