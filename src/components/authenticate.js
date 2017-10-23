import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import { connect } from 'react-redux'
import BLUETOOTH_STATUSES from '../constants/bluetooth'
import IconButton from 'material-ui/IconButton'
import BluetoothIcon from 'material-ui-icons/Bluetooth'
import BluetoothDisabledIcon from 'material-ui-icons/BluetoothDisabled'
import AccountBoxIcon from 'material-ui-icons/AccountBox'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import { setAdminToken } from '../store/actions'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import GAME_STATE from '../constants/game-state'

const log = debug('Authenticate')

class Authenticate extends Component {
  state = {
    open: false,
    password: ''
  }

  showSignInPanel = () => {
    this.setState({
      open: true
    })
  }

  signOut = () => {
    this.props.setAdminToken()
  }

  signIn = () => {
    this.props.setAdminToken(this.state.password)

    this.setState({
      open: false
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render () {
    return (
      <IconButton aria-label="Authenticate">
        {!this.props.authToken && <AccountBoxIcon onClick={this.showSignInPanel} /> }
        {this.props.authToken && <ExitToAppIcon onClick={this.signOut} /> }
        <Dialog open={this.state.open} onRequestClose={this.signIn}>
          <DialogTitle>PASSWORD</DialogTitle>
          <DialogContent>
              <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                margin="normal"
                onChange={this.handleChange('password')}
                value={this.state.password}
              />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.signIn}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </IconButton>
    )
  }
}

Authenticate.propTypes = {
  authToken: PropTypes.string
}

const mapStateToProps = ({ admin: { token } }) => ({
  authToken: token
})

const mapDispatchToProps = {
  setAdminToken
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Authenticate)
