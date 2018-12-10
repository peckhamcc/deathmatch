import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../../socket'
import { addDevice } from '../../store/actions'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from 'material-ui/Table'
import SearchIcon from 'material-ui-icons/Search'
import StopIcon from 'material-ui-icons/Stop'
import InfoIcon from 'material-ui-icons/Info'
import CachedIcon from 'material-ui-icons/Cached'
import BatteryIcon from 'material-ui-icons/BatteryStd'
import FlashOnIcon from 'material-ui-icons/FlashOn'
import ConnectIcon from 'material-ui-icons/AddBox'
import LoadingIcon from 'material-ui-icons/Refresh'
import UnknownIcon from 'material-ui-icons/Warning'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'

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
            {!this.props.scanning && <IconButton color="contrast" aria-label="Search for devices" onClick={this.startScan}>
                <SearchIcon />
              </IconButton>
            }
            {this.props.scanning && <IconButton color="contrast" aria-label="Stop searching" onClick={this.stopScan}>
                <StopIcon />
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
                '1818': <FlashOnIcon key='power' />,
                '180f': <BatteryIcon key='battery' />,
                '1816': <CachedIcon key='speed/cadence' />,
                '180a': <InfoIcon key='deviceinfo' />
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
                <UnknownIcon />,
                <ConnectIcon onClick={this.connect(device)} />,
                <LoadingIcon />,
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