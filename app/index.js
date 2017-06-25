import React from 'react'
import ReactDOM from 'react-dom'

import Home from './views/home/home'

const Application = () => (
  <Home />
)

ReactDOM.render(
  <Application />,
  document.getElementById('app')
)
