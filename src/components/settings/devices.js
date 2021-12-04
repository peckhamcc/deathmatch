import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../../socket/index.js'
import { addDevice } from '../../store/actions/index.js'
import { withStyles } from '@mui/styles/index.js'
import AppBar from '@mui/material/AppBar/index.js'
import Toolbar from '@mui/material/Toolbar/index.js'
import IconButton from '@mui/material/IconButton/index.js'
import Table from '@mui/material/Table/index.js'
import TableBody from '@mui/material/TableBody/index.js'
import TableCell from '@mui/material/TableCell/index.js'
import TableRow from '@mui/material/TableRow/index.js'
import SearchIcon from '@mui/icons-material/Search.js'
import StopIcon from '@mui/icons-material/Stop.js'
import InfoIcon from '@mui/icons-material/Info.js'
import CachedIcon from '@mui/icons-material/Cached.js'
import BatteryIcon from '@mui/icons-material/BatteryStd.js'
import FlashOnIcon from '@mui/icons-material/FlashOn.js'
import ConnectIcon from '@mui/icons-material/AddBox.js'
import LoadingIcon from '@mui/icons-material/Refresh.js'
import UnknownIcon from '@mui/icons-material/Warning.js'
import TextField from '@mui/material/TextField/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'

const styles = {

}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

class Devices extends Component {
  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    devices: PropTypes.array.isRequired,
    addDevice: PropTypes.func.isRequired,
    scanning: PropTypes.bool.isRequired,
    numPlayers: PropTypes.number.isRequired
  }

  startScan = () => {
    socket.emit('admin:devices:search:start', this.props.adminToken)
  }

  stopScan = () => {
    socket.emit('admin:devices:search:stop', this.props.adminToken)
  }

  connect = (device) => {
    return () => socket.emit('admin:devices:connect', this.props.adminToken, device.id)
  }

  assignDevice = (device) => {
    return (event) => socket.emit('admin:devices:assign', this.props.adminToken, device.id, event.target.value)
  }

  render () {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            {!this.props.scanning && <IconButton aria-label="Search for devices" onClick={this.startScan}>
                <SearchIcon.default />
              </IconButton>
            }
            {this.props.scanning && <IconButton aria-label="Stop searching" onClick={this.stopScan}>
                <StopIcon.default />
              </IconButton>
            }
          </Toolbar>
        </AppBar>
        <Table>
          <TableBody>
            {this.props.devices
              .filter(device => {
                console.info('device services', device.services)
                if (!device.services.length) {
                  return false
                }

                // power
                if (!device.services.includes('1818')) {
                  return false
                }

                // cadence
                if (!device.services.includes('1816')) {
                  return false
                }

                return true
              })
              .sort((a, b) => a.name - b.name)
              .map(device => {
              const serviceIcons = {
                '1818': <FlashOnIcon.default key='power' />,
                '180f': <BatteryIcon.default key='battery' />,
                '1816': <CachedIcon.default key='speed/cadence' />,
                '180a': <InfoIcon.default key='deviceinfo' />
              }

              const services = []

              device.services.forEach(id => {
                if (serviceIcons[id]) {
                  services.push(serviceIcons[id])
                } else {
                  console.warn('Do not know what to do with', id)
                }
              })

              if (!services.length) {
                return null
              }

              const statuses = [
                <UnknownIcon.default />,
                <ConnectIcon.default onClick={this.connect(device)} />,
                <LoadingIcon.default />,
                <TextField
                  id="assign-to"
                  label="Assign to"
                  margin="normal"
                  className={this.props.classes.textField}
                  onChange={this.assignDevice(device)}
                  value={device.player || 'none'}
                  select
                >
                  <MenuItem key='none' value='none'>
                    None
                  </MenuItem>
                  {
                    new Array(this.props.numPlayers).fill(0)
                    .map((_, index) => letters[index])
                    .map(letter => (
                      <MenuItem key={letter} value={letter.toUpperCase()}>
                        Player {letter.toUpperCase()}
                      </MenuItem>
                    ))
                  }
                </TextField>
              ]

              return (
                <TableRow
                key={device.id}
              >
                <TableCell padding="none">{device.name}</TableCell>
                <TableCell>{services}</TableCell>
                <TableCell>{device.power === undefined ? '-' : device.power}</TableCell>
                <TableCell>{device.cadence === undefined ? '-' : device.cadence}</TableCell>
                <TableCell>
                  {statuses[device.status]}
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = ({ admin: { token }, game: { numPlayers }, devices: { devices }, bluetooth: { searching } }) => ({
  adminToken: token,
  devices: devices,
  scanning: searching,
  numPlayers
})

const mapDispatchToProps = {
  addDevice
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Devices))