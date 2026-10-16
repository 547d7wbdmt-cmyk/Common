import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { MemberProvider } from './store'

// The shareable single-page build has no server routes, so it keeps the URL in memory.
const Router = import.meta.env.VITE_ARTIFACT ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <MemberProvider>
        <App />
      </MemberProvider>
    </Router>
  </StrictMode>,
)
