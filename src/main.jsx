import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BuilderProvider } from './context/BuilderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BuilderProvider>
      <App />
    </BuilderProvider>
  </StrictMode>,
)
