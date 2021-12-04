import React, { Component } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles/index.js'
import { grey, blue, red, green } from '@mui/material/colors/index.js'

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
