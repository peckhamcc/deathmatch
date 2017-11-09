import React, { Component } from 'react'
import ColouredText from './coloured-text'
import { STAGE_WIDTH } from '../constants/settings'

const MESSAGES = [
  ['Up!', ' ', 'Up!', ' ', 'Up!'],
  ['Sprint', ' ', 'for', ' ', 'the', ' ', 'line'],
  ['Go', ' ', 'for', ' ', 'it!'],
  ['More', ' ', 'power!'],
  ['Faster!'],
  ['You', ' ', 'can', ' ', 'do', ' ', 'it!']
]

const DISPLAY_TIME = 4000

class CountDown extends Component {
  state = {
    messageIndex: 0,
    wordIndex: 0,
    interval: 0
  }

  componentDidMount () {
    const messageIndex = Math.floor(Math.random() * MESSAGES.length)

    const longestWord = MESSAGES[messageIndex].reduce((longest, current) => {
      return current.length > longest ? current.length : longest
    }, 0)

    let size = Math.floor(STAGE_WIDTH / longestWord)

    if (size > 300) {
      size = 300
    }

    this.setState({
      messageIndex,
      wordIndex: 0,
      size
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
    let word = message[this.state.wordIndex]

    if (this.state.wordIndex >= message.length) {
      word = ''
    }

    return (
      <ColouredText
        message={word}
        size={this.state.size}
        font='"Press Start 2P", monospace'
      />
    )
  }
}

export default CountDown
