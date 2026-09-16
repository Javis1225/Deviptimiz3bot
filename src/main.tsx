import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initTelegram } from './lib/telegram'
import { loginWithTelegram } from './lib/session'
import './index.css'

// No-op outside Telegram (e.g. plain browser during development).
initTelegram()
// Best-effort: silently does nothing until Supabase + the telegram-auth
// function are deployed. Profile.tsx re-checks the result via getMyPoints().
loginWithTelegram()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
