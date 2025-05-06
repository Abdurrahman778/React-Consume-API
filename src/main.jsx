import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Add this
import 'bootstrap-icons/font/bootstrap-icons.css' // Add this if using bootstrap icons
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'
// import './index.css' 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
