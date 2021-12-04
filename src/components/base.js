import { Component } from 'react'
import { connect } from 'react-redux'

class Base extends Component {

}

const mapStateToProps = ({ game: { trackLength }, players: { players } }) => ({
  trackLength: trackLength,
  players: players
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base)
