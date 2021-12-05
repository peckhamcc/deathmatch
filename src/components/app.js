import React, { Component } from 'react'
import { ThemeProvider, createTheme } from '@material-ui/core/styles/index.js'
import { grey, blue, red, green } from '@material-ui/core/colors/index.js'

const theme = createTheme({
  typography: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 16
  },
  palette: {
    primary: grey,
    secondary: grey,
    info: blue,
    warning: red
  }
})

class App extends Component {
  render () {
    return (
      <ThemeProvider theme={theme}>
        <div>
          {this.props.children}
        </div>
      </ThemeProvider>
    )
  }
}

export default App
