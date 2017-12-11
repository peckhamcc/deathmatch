import '../assets/pcc-avatar.png'
import './css/Index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createStore from './store/create-store'
import { GameContainer } from './containers'
import { App, ToolBar } from './components'
import socket from './socket'
import assets from './css/assets'
import {
  updateGameState,
  setLoadProgress
} from './store/actions'
import GAME_STATE from './constants/game-state'

socket.on('init', ({ state }) => {
  const store = createStore(state)

  store.dispatch(updateGameState(GAME_STATE.loading))
  
    assets.load(state.riders.riders, (done, total) => {
      store.dispatch(setLoadProgress(100 - parseInt((done / total) * 100, 10)))
    }, () => {
      store.dispatch(updateGameState(state.game.state))
    })

  ReactDOM.render(
    <div>
      <Provider store={store}>
        <App>
          <ToolBar />
          <GameContainer />
        </App>
      </Provider>
    </div>,
    document.getElementById('app')
  )  
})

export {
  GameContainer
}
