import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import { connect } from 'react-redux'
import BLUETOOTH_STATUSES from '../constants/bluetooth'
import IconButton from 'material-ui/IconButton'
import BluetoothIcon from 'material-ui-icons/Bluetooth'
import BluetoothDisabledIcon from 'material-ui-icons/BluetoothDisabled'
import ErrorIcon from 'material-ui-icons/Error'
import GAME_STATE from '../constants/game-state'

const log = debug('BluetoothState')

const BluetoothState = ({ status }) => {
  return (
    <IconButton aria-label='Bluetooth status'>
      {status === 'unknown' && <ErrorIcon /> }
      {status === 'poweredOff' && <BluetoothDisabledIcon /> }
      {status === 'poweredOn' && <BluetoothIcon /> }
    </IconButton>
  )
}

BluetoothState.propTypes = {
  status: PropTypes.string.isRequired
}

BluetoothState.defaultProps = {
  status: 'poweredOff'
}

const mapStateToProps = ({ bluetooth: { status } }) => ({
  status: status
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BluetoothState)
