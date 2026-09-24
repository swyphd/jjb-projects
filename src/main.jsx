import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './Home.jsx'

// The public site lives at "/"; the internal proposal portal lives at "/portal".
const isPortal = /^\/portal(\/|$)/.test(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isPortal ? <App /> : <Home />}</React.StrictMode>
)
