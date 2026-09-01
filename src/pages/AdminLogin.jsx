import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/merch-inc-logo.png'

function AdminLogin() {
   const navigate = useNavigate()

   const [formData, setFormData] = useState({
      email: '',
      password: '',
   })
   const [status, setStatus] = useState({ type: '', message: '' })

   const handleChange = (event) => {
      const { name, value } = event.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const handleLogin = (event) => {
      event.preventDefault()
      setStatus({ type: '', message: '' })

      if (!formData.email || !formData.password) {
         setStatus({ type: 'error', message: 'Please fill out all required fields.' })
         return
      }

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (formData.email !== adminEmail || formData.password !== adminPassword) {
         setStatus({ type: 'error', message: 'Invalid admin credentials.' })
         return
      }

      sessionStorage.setItem('isAdmin', 'true')
      navigate('/admin')
   }


   return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-xs sm:text-sm">
         <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-4 items-center text-center">
               <img src={logo} alt="Merch Inc Logo" className="w-20 h-auto" />
               <div>
                  <h1 className="text-xl font-semibold">Admin Log In</h1>
               </div>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
               <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-medium">Email</label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                     placeholder="example@gmail.com"
                  />
               </div>
               <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="font-medium">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                     placeholder="*********"
                  />
               </div>
               {status.message ? (
                  <p
                     className={
                        status.type === 'error'
                           ? 'text-red-600 text-xs'
                           : 'text-green-600 text-xs'
                     }
                  >
                     {status.message}
                  </p>
               ) : null}
               <button className="bg-black text-white p-3 rounded-sm font-medium hover:opacity-80 transition-colors" type="submit">Log In</button>
            </form>
         </div>
      </div>
   )
}

export default AdminLogin
