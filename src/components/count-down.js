import React, { Component } from 'react'
import ColouredText from './coloured-text.js'

class CountDown extends Component {
  state = {
    count: 5
  }

  countDown = () => {
    this.setState(s => ({
      count: s.count - 1
    }))
  }

  componentDidMount () {
    this.interval = setInterval(this.countDown, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    let message = '' + this.state.count

    if (this.state.count < 1) {
      message = 'Go!'
    }

    return (
      <ColouredText
        message={message}
      />
    )
  }
}

export default CountDown
