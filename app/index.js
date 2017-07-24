import React from 'react'
import ReactDOM from 'react-dom'

import App from './views/app/app'

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  )
}

render()

if (module.hot) {
  module.hot.accept('./views/app/app', () => {
    render()
  })
}
