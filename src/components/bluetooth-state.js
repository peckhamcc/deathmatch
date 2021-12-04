import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IconButton from '@mui/material/IconButton/index.js'
import BluetoothIcon from '@mui/icons-material/Bluetooth.js'
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled.js'
import ErrorIcon from '@mui/icons-material/Error.js'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const BluetoothState = ({ status }) => {
  return (
    <Wrapper>
      <IconButton aria-label='Bluetooth status'>
        {status === 'unknown' && <ErrorIcon />}
        {status === 'poweredOff' && <BluetoothDisabledIcon.default />}
        {status === 'poweredOn' && <BluetoothIcon.default />}
      </IconButton>
    </Wrapper>
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
