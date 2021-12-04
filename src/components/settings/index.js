import React, { Component } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import Tabs from '@mui/material/Tabs/index.js'
import Tab from '@mui/material/Tab/index.js'
import IconButton from '@mui/material/IconButton/index.js'
import SettingsIcon from '@mui/icons-material/Settings.js'
import Devices from './devices.js'
import Riders from './riders.js'
import Game from './game.js'

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

  hideSettings = (event) => {
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
        <IconButton aria-label="Show settings" onClick={this.showSettings}>
          <SettingsIcon.default />
        </IconButton>
        <Dialog
          open={open}
          onClose={this.hideSettings}
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
            <Button onClick={this.hideSettings}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Wrapper>
    )
  }
}

export default Settings
