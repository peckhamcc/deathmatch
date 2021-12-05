import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import PhotoTaker from './photo-taker.js'
import defaultPhoto from '../../../assets/rider-female-0.png'
import { PHOTO_WIDTH, PHOTO_HEIGHT } from '../../constants/settings.js'

const Wrapper = styled.div`
  width: ${PHOTO_WIDTH}px;
  height: ${PHOTO_HEIGHT}px;
  display: inline-block;
`

const PhotoTitle = styled.p`
  font-size: 16px;
  text-align: center;
`

const PhotoDisplayWrapper = styled.div`
  text-align: center;
`

const PhotoDisplay = ({ image, onTakePhoto }) => {
  return (
    <PhotoDisplayWrapper>
      <img src={image} width={PHOTO_WIDTH} height={PHOTO_HEIGHT} />
      <Button onClick={onTakePhoto}>Take photo</Button>
    </PhotoDisplayWrapper>
  )
}

class Photo extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onPhotoTaken: PropTypes.func.isRequired
  }

  static defaultProps = {
    image: defaultPhoto
  }

  state = {
    takingPhoto: false
  }

  componentDidMount () {
    this.setState({
      takingPhoto: false
    })
  }

  onTakePhoto = () => {
    this.setState({
      takingPhoto: true
    })
  }

  onPhotoTaken = (image) => {
    this.props.onPhotoTaken(image)

    this.setState({
      takingPhoto: false
    })
  }

  render () {
    return (
      <Wrapper>
        <PhotoTitle>{this.props.text}</PhotoTitle>
        {this.state.takingPhoto && <PhotoTaker onPhoto={this.onPhotoTaken} />}
        {!this.state.takingPhoto && <PhotoDisplay image={this.props.image} onTakePhoto={this.onTakePhoto} />}
      </Wrapper>
    )
  }
}

export default Photo
