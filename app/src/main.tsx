import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { WalletProvider } from './store'

// The shareable single-file build runs in a sandboxed frame, so it keeps routes in memory.
// VITE_START_PATH picks the first screen (e.g. /merchant for the merchant portal link).
const start = import.meta.env.VITE_START_PATH || '/'
function Router({ children }: { children: ReactNode }) {
  return import.meta.env.MODE === 'artifact'
    ? <MemoryRouter initialEntries={[start]}>{children}</MemoryRouter>
    : <BrowserRouter>{children}</BrowserRouter>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <WalletProvider>
        <App />
      </WalletProvider>
    </Router>
  </StrictMode>,
)
