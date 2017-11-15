import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Layer, Rect, Stage, Group, Text, Image, Sprite } from 'react-konva'
import { addAnimateable, removeAnimateable } from './animator'
import assets from '../css/assets'

class Background extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }

  state = {
    xOffset: 0
  }

  componentDidUpdate () {
    if (!this.animating) {
      this.animating = addAnimateable(this.animate)
    }
  }

  componentWillUnmount = () => {
    this.animating = removeAnimateable(this.animate)
  }

  animate = () => {
    this.setState(s => {
      let offset = s.xOffset - this.props.speed

      if (offset < (0 - (this.props.width - 1025))) {
        offset = 0
      }

      return {
        xOffset: offset
      }
    })
  }

  render () {
    return (
      <Image
        image={assets.get(this.props.image)}
        x={0 + this.state.xOffset}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}

export default Background
