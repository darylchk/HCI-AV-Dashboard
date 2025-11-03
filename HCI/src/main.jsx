import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExperimentProvider } from './Components/experiment/ExperimentContext.jsx'
import './index.css'
import Dashboard from './pages/Dashboard'
import OBU from './pages/OBU'
import PresenterControl from './pages/PresenterControl'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ExperimentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/obu" element={<OBU />} />
            <Route path="/presenter" element={<PresenterControl />} />
          </Routes>
        </BrowserRouter>
      </ExperimentProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
