import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { DoubleDounceLoading } from 'styled-spinkit'

const ConnectingPanel = styled.div`
  color: #FFF;
  width: 150px;
  position: absolute;
  top: 50px;
  left: 50%;
  margin-left: -75px;
  font-size: 16px;
  text-align: center;
`

const Connecting = () => {
  return (
    <ConnectingPanel>
      <DoubleDounceLoading color='#FFFFFF' />
      <p>Connecting</p>
    </ConnectingPanel>
  )
}

export default Connecting
