import React from 'react'
import { connect } from 'react-redux'
import BluetoothState from './bluetooth-state'
import Settings from './settings'

const toolbar = ({ demo }) => {
  if (demo) {
    return null
  }

  return (
    <div>
      <BluetoothState />
      <Settings />
    </div>
  )

  return null
}

const mapStateToProps = ({ game: { demo } }) => ({
  demo
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toolbar)
