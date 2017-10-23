import React, { Component } from 'react'
import { withStyles, MuiThemeProvider } from 'material-ui/styles'
import { createMuiTheme } from 'material-ui/styles'
import { purple, green } from 'material-ui/colors'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  }
})

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
    }
  }
})

let AppWrapper = props => props.children

AppWrapper = withStyles(styles)(AppWrapper)

const context = {
  theme
}

const withRoot = (BaseComponent) => {
  class WithRoot extends Component {
    render () {
      return (
        <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
          <AppWrapper>
            {props.children}
          </AppWrapper>
        </MuiThemeProvider>
      )
    }
  }

  return WithRoot
}

export default withRoot
