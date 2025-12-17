import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router'
import './App.css'
import AdminPortal from './pages/AdminPortal.jsx'
import DesignerPortal from './pages/DesignerPortal.jsx'
import ModelPortal from './pages/ModelPortal.jsx'

function App() {
  return (
    <BrowserRouter>
      <main>
          <Routes>
            <Route path="/" element={<Navigate to="/model" replace />} />
            <Route path="/model" element={<ModelPortal />} />
            <Route path="/designer" element={<DesignerPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
