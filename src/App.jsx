import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router'
import './App.css'
import AdminPortal from './pages/AdminPortal.jsx'
import DesignerPortal from './pages/DesignerPortal.jsx'
import ModelPortal from './pages/ModelPortal.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <BrowserRouter>
      <main>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/model" element={<ModelPortal />} />
            <Route path="/designer" element={<DesignerPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
