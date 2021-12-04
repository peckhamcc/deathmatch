import '../assets/pcc-avatar.png'
import './css/Index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import makeStore from './store/create-store.js'
import { GameContainer } from './containers/index.js'
import { ToolBar } from './components/index.js'
import socket from './socket/index.js'
import assets from './css/assets.js'
import {
  updateGameState,
  setLoadProgress
} from './store/actions/index.js'
import GAME_STATE from './constants/game-state.js'
import { ThemeProvider, createTheme } from '@mui/material/styles/index.js'
import { grey, blueGrey, blue, red } from '@mui/material/colors/index.js'

const theme = createTheme({
  typography: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 16
  },
  palette: {
    primary: grey,
    secondary: blueGrey,
    info: blue,
    warning: red
  }
})

socket.on('init', ({ state }) => {
  const store = makeStore(state)
  store.dispatch(updateGameState(GAME_STATE.loading))

  assets.load(state.riders.riders, (done, total) => {
    store.dispatch(setLoadProgress(100 - parseInt((done / total) * 100, 10)))
  }, () => {
    store.dispatch(updateGameState(state.game.state))
  })

  ReactDOM.render(
    <div>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ToolBar />
          <GameContainer />
        </Provider>
      </ThemeProvider>
    </div>,
    document.getElementById('app')
  )
})

export {
  GameContainer
}
