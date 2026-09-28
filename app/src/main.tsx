import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { WalletProvider } from './store'

// The shareable single-file build runs in a sandboxed frame, so it keeps routes in memory.
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <WalletProvider>
        <App />
      </WalletProvider>
    </Router>
  </StrictMode>,
)
