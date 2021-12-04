import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Pulse } from 'styled-spinkit'

const LoadingPanel = styled.div`
  color: #FFF;
  width: 250px;
  position: absolute;
  top: 50px;
  left: 50%;
  margin-left: -125px;
  font-size: 16px;
  text-align: center;
`

const Loading = ({ loaded }) => {
  return (
    <LoadingPanel>
      <Pulse color='#FFFFFF' />
      <p>Loading {loaded}%</p>
    </LoadingPanel>
  )
}

const mapStateToProps = ({ game: { loaded } }) => ({
  loaded: loaded
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
