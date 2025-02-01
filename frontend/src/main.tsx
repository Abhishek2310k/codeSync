import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Theme appearance="dark" accentColor="ruby" radius="large"> */}
      <App />
    {/* </Theme> */}
  </StrictMode>,
)
