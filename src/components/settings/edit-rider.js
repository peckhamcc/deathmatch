import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import MenuIcon from 'material-ui-icons/Menu'
import keycode from 'keycode'
import Checkbox from 'material-ui/Checkbox'
import Tooltip from 'material-ui/Tooltip'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import styled from 'styled-components'
import shortid from 'shortid'
import socket from '../../socket'
import Photo from './photo'
import { PHOTO_WIDTH, PHOTO_HEIGHT } from '../../constants/settings'

const styles = {

}

const PhotosWrapper = styled.div`
  height: 693px;
`

class EditRider extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    adminToken: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    rider: PropTypes.object
  }

  static defaultProps = {
    gender: 'male'
  }

  state = {
    mediaStream: null
  }

  componentDidMount () {
    // Prefer camera resolution nearest to 1280x720.
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

  componentWillReceiveProps (props) {
    this.setState({
      name: props.rider && props.rider.name,
      age: props.rider && props.rider.age,
      weight: props.rider && props.rider.weight,
      gender: (props.rider && props.rider.gender) || 'male',
      photoSelect: (props.rider && props.rider.photoSelect),
      photoWin: (props.rider && props.rider.photoWin),
      photoLose: (props.rider && props.rider.photoLose),
      photoPower: (props.rider && props.rider.photoPower)
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  saveRider = () => {
    if (!this.state.name || !this.state.age || !this.state.weight) {
      return
    }

    this.props.onSave({
      name: this.state.name,
      age: this.state.age,
      weight: this.state.weight,
      gender: this.state.gender,
      photoSelect: this.state.photoSelect,
      photoWin: this.state.photoWin,
      photoLose: this.state.photoLose,
      photoPower: this.state.photoPower
    })

    this.setState({
      name: null,
      age: null,
      weight: null,
      gender: 'male',
      photoSelect: null,
      photoWin: null,
      photoLose: null,
      photoPower: null
    })
  }

  onPhotoTaken = (type) => (photo) => {
    const id = shortid.generate()

    socket.once(`admin:photo:uploaded:${id}`, (path) => {
      this.setState(s => {
        return {
          [`photo${type.substring(0, 1).toUpperCase()}${type.substring(1)}`]: path
        }
      })
    })

    socket.emit('admin:photo:upload', this.props.adminToken, id, photo)
  }

  render () {
    const { classes } = this.props

    return (
      <Dialog open={this.props.open} onRequestClose={this.props.onCancel} maxWidth='md'>
        <DialogTitle>Add rider</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              id="name"
              label="Name"
              margin="normal"
              className={classes.textField}
              onChange={this.handleChange('name')}
              value={this.state.name}
              required
            />
            <TextField
              id="age"
              label="Age"
              margin="normal"
              type='number'
              className={classes.textField}
              onChange={this.handleChange('age')}
              value={this.state.age}
              required
            />
            <TextField
              id="weight"
              label="Weight (kg)"
              margin="normal"
              type='number'
              className={classes.textField}
              onChange={this.handleChange('weight')}
              value={this.state.weight}
              required
            />
            <TextField
              id="gender"
              label="Gender"
              margin="normal"
              className={classes.textField}
              onChange={this.handleChange('gender')}
              value={this.state.gender}
              select
            >
              <MenuItem key='male' value='male'>
                Male
              </MenuItem>
              <MenuItem key='female' value='female'>
                Female
              </MenuItem>
            </TextField>
            <PhotosWrapper>
              <Photo text='Game face' image={this.state.photoSelect} onPhotoTaken={this.onPhotoTaken('select')} />
              <Photo text='Happy face' image={this.state.photoWin} onPhotoTaken={this.onPhotoTaken('win')} />
              <Photo text='Sad face' image={this.state.photoLose} onPhotoTaken={this.onPhotoTaken('lose')} />
              <Photo text='Power face' image={this.state.photoPower} onPhotoTaken={this.onPhotoTaken('power')} />
            </PhotosWrapper>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.saveRider}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = ({ admin: { token } }) => ({
  adminToken: token
})

const mapDispatchToProps = {
  
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditRider))

