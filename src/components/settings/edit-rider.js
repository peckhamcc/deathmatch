import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
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

const styles = {

}

class RiderForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    rider: PropTypes.object
  }

  static defaultProps = {
    gender: 'male'
  }

  state = {

  }

  componentWillReceiveProps (props) {
    this.setState({
      name: props.rider && props.rider.name,
      age: props.rider && props.rider.age,
      weight: props.rider && props.rider.weight,
      gender: (props.rider && props.rider.gender) || 'male'
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  saveRider = () => {
    if (!this.state.name || !this.state.age || !this.state.weight) {
      return
    }

    this.props.onSave({
      name: this.state.name,
      age: this.state.age,
      weight: this.state.weight,
      gender: this.state.gender
    })

    this.setState({
      name: null,
      age: null,
      weight: null,
      gender: 'male'
    })
  }

  render () {
    const { classes } = this.props

    return (
      <Dialog open={this.props.open} onRequestClose={this.props.onCancel}>
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

export default withStyles(styles)(RiderForm);
