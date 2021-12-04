import React from 'react'
import { connect } from 'react-redux'
import BluetoothState from './bluetooth-state.js'
import Settings from './settings/index.js'

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
