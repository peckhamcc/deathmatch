import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../../socket'
import { addDevice } from '../../store/actions'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import keycode from 'keycode'
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import Checkbox from 'material-ui/Checkbox'
import Tooltip from 'material-ui/Tooltip'
import DeleteIcon from 'material-ui-icons/Delete'
import SearchIcon from 'material-ui-icons/Search'
import StopIcon from 'material-ui-icons/Stop'
import PowerIcon from 'material-ui-icons/Power'
import InfoIcon from 'material-ui-icons/Info'
import CachedIcon from 'material-ui-icons/Cached'
import BatteryIcon from 'material-ui-icons/BatteryStd'
import BluetoothConnectIcon from 'material-ui-icons/BluetoothConnected'
import FlashOnIcon from 'material-ui-icons/FlashOn'
import ConnectIcon from 'material-ui-icons/AddBox'

class Devices extends Component {
  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    devices: PropTypes.array.isRequired,
    addDevice: PropTypes.func.isRequired,
    scanning: PropTypes.bool.isRequired
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
              .filter(device => device.services.length)
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

              return (
                <TableRow
                key={device.id}
              >
                <TableCell padding="none">{device.name}</TableCell>
                <TableCell>{services}</TableCell>
                <TableCell>{device.power || '-'}</TableCell>
                <TableCell>{device.cadence || '-'}</TableCell>
                <TableCell>
                  <ConnectIcon onClick={this.connect(device)} />
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
    
    /*<div>
      <ul>
        <li onClick={this.startScan}>Scan</li>
      </ul>
      <ul>
        {this.props.devices.map(device => {
          return <div key={device.id}>device.name</div>
        })}
      </ul>
      {this.state.scanning && <p onClick={this.stopScan}>Stop scanning</p>}
    </div>*/
  }
}

const mapStateToProps = ({ admin: {token}, devices: { devices }, bluetooth: { searching } }) => ({
  adminToken: token,
  devices: devices,
  scanning: searching
})

const mapDispatchToProps = {
  addDevice
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Devices)