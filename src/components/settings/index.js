import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'material-ui/Button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog'
import Tabs, {
  Tab
} from 'material-ui/Tabs'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui-icons/Settings'
import Devices from './devices'
import Riders from './riders'
import Game from './game'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`

const tabs = [
  Devices,
  Riders,
  Game
]

class Settings extends Component {
  state = {
    tab: 0,
    open: false
  }

  showSettings = () => {
    this.setState({
      open: true
    })
  }

  hideSettings = () => {
    this.setState({
      open: false
    })
  }

  showDevices = () => {
    this.setState({
      tab: tabs.devices
    })
  }

  showRiders = () => {
    this.setState({
      tab: tabs.riders
    })
  }

  handleTabChange = (event, value) => {
    this.setState({
      tab: value
    })
  }

  render () {
    const { tab, open } = this.state
    const Panel = tabs[this.state.tab]

    return (
      <Wrapper>
        <IconButton aria-label="Delete" onClick={this.showSettings}>
          <SettingsIcon />
          <Dialog
            open={open}
            onRequestClose={this.hideSettings}
            fullScreen>
            <DialogTitle>SETTINGS</DialogTitle>
            <DialogContent>
              <Tabs value={tab} onChange={this.handleTabChange}>
                <Tab label='DEVICES' />
                <Tab label='RIDERS' />
                <Tab label='GAME' />
              </Tabs>
              <Panel socket={this.props.socket} />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.hideSettings}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </IconButton>
      </Wrapper>
    )
  }
}

export default Settings
