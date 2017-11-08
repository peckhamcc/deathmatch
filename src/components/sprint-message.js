import React, { Component } from 'react'
import ColouredText from './coloured-text'

const MESSAGES = [
  'Up Up! UP!'.split(/\s/),
  'Sprint for the line'.split(/\s/)
]

const DISPLAY_TIME = 2000

class CountDown extends Component {
  state = {
    messageIndex: 0,
    wordIndex: 0,
    interval: 0
  }

  componentDidMount () {
    const messageIndex = Math.floor(Math.random() * MESSAGES.length)

    this.setState({
      messageIndex,
      wordIndex: 0
    })

    this.interval = setInterval(() => {
      this.setState(s => ({
        wordIndex: s.wordIndex + 1
      }))
    }, DISPLAY_TIME / MESSAGES[messageIndex].length)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    let message = MESSAGES[this.state.messageIndex]

    if (this.state.wordIndex >= message.length) {
      return null
    }

    let word = message[this.state.wordIndex]

    return (
      <ColouredText
        message={word}
        size={300}
        font='"Press Start 2P", monospace'
      />
    )
  }
}

export default CountDown
