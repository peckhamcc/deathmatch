import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IconButton } from '@material-ui/core'
import {
  Bluetooth as BluetoothIcon,
  BluetoothDisabled as BluetoothDisabledIcon,
  Error as ErrorIcon
} from '@material-ui/icons'
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
        {status === 'poweredOff' && <BluetoothDisabledIcon />}
        {status === 'poweredOn' && <BluetoothIcon />}
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
