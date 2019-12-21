import React, { Component } from 'react'
import { withStyles, MuiThemeProvider } from 'material-ui/styles'
import { createMuiTheme } from 'material-ui/styles'
import { grey } from 'material-ui/colors'

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: grey
  }
})

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      fontSize: 16
    },
    body: {
      margin: 0
    }
  }
})

const context = {
  theme
}

class App extends Component {
  render () {
    return (
      <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
        <div>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App)
