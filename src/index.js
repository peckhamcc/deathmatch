import '../assets/pcc-avatar.png'
import './css/Index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configure-store'
import { GameContainer } from './containers'
import { App, ToolBar } from './components'

ReactDOM.render(
  <div>
    <Provider store={configureStore()}>
      <App>
        <ToolBar />
        <GameContainer />
      </App>
    </Provider>
  </div>,
  document.getElementById('app')
)

export {
  GameContainer
}
