import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

const LoadingPanel = styled.div`
  color: #F10
`

const Loading = ({ loaded }) => {
  return (
    <LoadingPanel>Loading {loaded}%...</LoadingPanel>
  )
}

const mapStateToProps = ({ game: { loaded }}) => ({
  loaded: loaded
})

const mapDispatchToProps = {
  
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
