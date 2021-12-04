import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button/index.js'
import styled from 'styled-components'
import { PHOTO_WIDTH, PHOTO_HEIGHT } from '../../constants/settings.js'

const VideoWrapper = styled.div`
  width: ${PHOTO_WIDTH}px;
  height: ${PHOTO_HEIGHT}px;
  display: inline-block;
  text-align: center;
`

class PhotoTaker extends Component {
  static propTypes = {
    onPhoto: PropTypes.func.isRequired
  }

  state = {
    mediaStream: null
  }

  videoLoaded = (ref) => {
    if (ref) {
      this.video = ref

      const constraints = {
        audio: false,
        video: {
          width: PHOTO_WIDTH,
          height: PHOTO_HEIGHT
        }
      }

      navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        ref.srcObject = mediaStream
        ref.onloadedmetadata = () => {
          ref.play()
        }
      })
      .catch((err) => console.log(err.name + ": " + err.message))
    }
  }

  savePhoto = () => {
    if (!this.video) {
      console.error('No video element..')
    }

    const canvas = document.createElement('canvas')
    canvas.width = PHOTO_WIDTH
    canvas.height = PHOTO_HEIGHT
    canvas.getContext('2d').drawImage(this.video, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT)
    const img = canvas.toDataURL('image/png')

    this.props.onPhoto(img)
  }

  render () {
    return (
      <VideoWrapper>
        <video height={PHOTO_HEIGHT} width={PHOTO_WIDTH} ref={this.videoLoaded}></video>
        <Button onClick={this.savePhoto}>Take photo</Button>
      </VideoWrapper>
    )
  }
}

export default PhotoTaker
