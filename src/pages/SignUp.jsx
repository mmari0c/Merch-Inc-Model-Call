import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/merch-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function SignUp() {
   const [formData, setFormData] = useState({
      role: 'model',
      fullName: '',
      email: '',
      phoneNumber: '',
   })
   const [submittedData, setSubmittedData] = useState(null)
   const [status, setStatus] = useState({ type: '', message: '' })

   const slugify = (value) =>
      value
         .trim()
         .toLowerCase()
         .replace(/[^a-z0-9\s-]/g, '')
         .replace(/\s+/g, '-')

   const handleChange = (event) => {
      const { name, value } = event.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const handleSignUp = (event) => {
      event.preventDefault()
      setStatus({ type: '', message: '' })

      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
         setStatus({ type: 'error', message: 'Please fill out all required fields.' })
         return
      }

      setSubmittedData(formData)
      setStatus({
         type: 'success',
         message: `Signed up locally. Thank you for joining the model call as a ${formData.role}!`,
      })
      setFormData((prev) => ({ ...prev, fullName: '', email: '', phoneNumber: '' }))
      console.log('Form Data Submitted:', formData)
   }


   return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-xs sm:text-sm">
         <div className={`${status.type === 'success' ? 'hidden' : 'block'} w-full max-w-5xl flex flex-col gap-10 items-center md:flex-row md:items-center md:gap-16`}>
            <div className='w-full md:w-1/2 flex flex-col gap-4 items-center text-center'>
               <img src={logo} alt="Merch Inc Logo" className="w-30 md:w-70 lg:w-90 h-auto" />
            </div>
            <div className='w-full md:w-1/2 flex flex-col gap-5'>
               <div className='text-center md:text-left'>
                  <h1 className='text-xl font-semibold'>Model Call Sign Up</h1>
                  <p className='text-gray-500'>Register as a model or designer to get started.</p>
               </div>
               <form onSubmit={handleSignUp} className="bg-white border-2 border-gray-200 p-5 rounded-lg flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1">
                     <label htmlFor="role" className="font-medium">I am a...</label>
                     <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400"
                     >
                        <option value="model">Model</option>
                        <option value="designer">Designer</option>
                     </select>
                  </div>
                  <div className="flex flex-col gap-1">
                     <label htmlFor="fullName" className="font-medium">Full Name</label>
                     <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400"
                     />
                  </div>

                  <div className="flex flex-col gap-1">
                     <label htmlFor="email" className="font-medium">Email Address</label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400"
                     />
                  </div>

                  <div className="flex flex-col gap-1">
                     <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
                     <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400"
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
                  <button className="bg-sand-600 text-white p-3 rounded-lg font-medium hover:bg-sand-700 transition-colors" type="submit">Join Model Call</button>
               </form>
            </div>
         </div>
         <div className={`${status.type === 'success' ? 'block' : 'hidden'} max-w-sm w-full bg-white p-8 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center gap-4 h-fit mt-6 `}>
            <FontAwesomeIcon className='bg-gray-200 p-5 text-lg rounded-full' icon={icons.check}/>
            <p>Welcome {submittedData?.fullName}!</p>
            <p className='text-gray-500'>You've successfully registered as a {submittedData?.role}.</p>
            { submittedData?.role === 'model' && (
               <div className='w-full flex flex-col gap-2 items-center text-center'>
                  <p>Your assigned number:</p>
                  <p className='border border-dashed p-6 rounded-md w-full text-center'><strong>M-001</strong></p>
               </div>
            )}
            <div className='w-full flex flex-col gap-2 items-center text-center border-t border-gray-200 pt-4'>
               <p>{submittedData?.role === 'model' ? 'Complete your profile for better chances of getting picked!' : 'Head over to the Designer Portal to start viewing models!'}</p>
               <Link
                  to={submittedData?.role === 'model' ? `/profile/${slugify(submittedData?.fullName || '')}` : '/designer-portal'}
                  className="w-full bg-sand-500 p-3 rounded-lg text-center"
               >
                  {submittedData?.role === 'model' ? 'Complete Profile' : 'Go to Designer Portal'}
               </Link>
            </div>
         </div>
      </div>
   )
}

export default SignUp
