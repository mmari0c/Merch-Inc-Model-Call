import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router'
import './App.css'
import AdminPortal from './pages/AdminPortal.jsx'
import DesignerPortal from './pages/DesignerPortal.jsx'
import ModelPortal from './pages/ModelPortal.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import Confirmation from './pages/Confirmation.jsx'

function App() {
  return (
    <BrowserRouter>
      <main>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile/:modelName" element={<Profile />} />
            <Route path="/model/:modelName" element={<ModelPortal />} />
            <Route path="/designer-portal" element={<DesignerPortal />} />
            <Route path="/confirmation/:role" element={<Confirmation />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
