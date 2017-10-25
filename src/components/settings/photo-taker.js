import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import styled from 'styled-components'

const VideoWrapper = styled.div`
  height: 693px;
  width: 572px;
  display: inline-block
`

class PhotoTaker extends Component {
  static propTypes = {
    onPhoto: PropTypes.func.isRequired
  }

  state = {
    mediaStream: null
  }

  componentDidMount () {
    const constraints = {
      audio: false,
      video: {
        width: 572,
        height: 693
      }
    } 

    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        this.setState({
          mediaStream
        })
      })
      .catch((err) => console.log(err.name + ": " + err.message))
  }

  videoLoaded = (ref) => {
    if (ref && this.state.mediaStream) {
      ref.srcObject = this.state.mediaStream
      ref.onloadedmetadata = () => {
        ref.play()
      }
    }
  }

  render () {
    const { classes } = this.props

    return (
      <VideoWrapper>
        <Button color="primary" onClick={this.saveRider}>OK</Button>
        <video height={693} width={572} ref={this.videoLoaded}></video>
      </VideoWrapper>
    )
  }
}

export default RiderForm
