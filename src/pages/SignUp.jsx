import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/merch-inc-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import { supabase } from '../client.js'

function SignUp() {
   const [formData, setFormData] = useState({
      role: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
   })
   const [submittedData, setSubmittedData] = useState(null)
   const [status, setStatus] = useState({ type: '', message: '' })
   const [isSubmitting, setIsSubmitting] = useState(false)

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

   const handleSignUp = async (event) => {
      event.preventDefault()
      setStatus({ type: '', message: '' })

      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role || !formData.phone) {
         setStatus({ type: 'error', message: 'Please fill out all required fields.' })
         return
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      setIsSubmitting(true)

      const { data, error } = await supabase.auth.signUp({
         email: formData.email,
         password: formData.password,
         options: {
            data: {
               role: formData.role,
               first_name: formData.firstName,
               last_name: formData.lastName,
               full_name: fullName,
            },
         },
      })

      if (error) {
         setStatus({ type: 'error', message: error.message })
         setIsSubmitting(false)
         return
      }

      if (formData.role === 'designer' && data?.user?.id) {
         const { error: designerError } = await supabase
            .from('designer')
            .insert({ designer_id: data.user.id, name: fullName, email: formData.email, phone: formData.phone || null })

         if (designerError) {
            setStatus({
               type: 'error',
               message: designerError.message,
            })
            setIsSubmitting(false)
            return
         }
      }

      setSubmittedData({ ...formData, fullName })
      setStatus({
         type: 'success',
         message: 'Sign up complete! Check your email if confirmation is required.',
      })
      setIsSubmitting(false)
   }


   return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-xs sm:text-sm">
         <div className={`${status.type === 'success' ? 'hidden' : 'block'} w-full max-w-5xl flex flex-col gap-10 items-center md:flex-row md:items-center md:gap-16`}>
            <div className='w-full md:w-1/2 flex flex-col gap-4 items-center text-center'>
               <img src={logo} alt="Merch Inc Logo" className="w-25 md:w-70 lg:w-90 h-auto" />
            </div>
            <div className='w-full items-center  md:w-1/2 flex flex-col gap-5'>
               <div className='text-center'>
                  <h1 className='text-xl font-semibold'>Model Call Sign Up</h1>
                  <p className='text-gray-500'>Ready to make the model call process seamless?</p>
               </div>
               <form onSubmit={handleSignUp} className="border-2 border-gray-100 p-5 rounded-lg flex flex-col  gap-4 w-md">
                  <div className="flex flex-col gap-1 ">
                     <label htmlFor="role" className="font-medium">I am a...</label>
                     <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                     >
                        <option className='text-gray-400' value="" disabled hidden>Select role</option>
                        <option className='text-black' value="model">Model</option>
                        <option className='text-black' value="designer">Designer</option>
                     </select>
                  </div>
                  <div className="flex gap-1 w-full">
                     <div className='w-1/2 flex flex-col gap-1'>
                        <label htmlFor="firstName" className="font-medium">First Name</label>
                        <input
                           type="text"
                           id="firstName"
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}
                           className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                           placeholder='Jane'
                        />
                     </div>
                     <div className='w-1/2 flex flex-col gap-1'>
                        <label htmlFor="lastName" className="font-medium">Last Name</label>
                        <input
                           type="text"
                           id="lastName"
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}
                           className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                           placeholder='Doe'
                        />
                     </div>
                  </div>

                  <div className="flex flex-col gap-1">
                     <label htmlFor="email" className="font-medium">Email</label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder='example@gmail.com'
                     />
                     </div>
                     <div className="flex flex-col gap-1">
                        <label htmlFor="phone" className="font-medium">Phone Number</label>
                        <input
                           type="tel"
                           id="phone"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                           placeholder='123-456-7890'
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
                        placeholder='At least 6 characters'
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
                  <button
                     className="bg-black text-white p-3 font-medium hover:opacity-80 transition-colors disabled:opacity-60"
                     type="submit"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Creating Account...' : 'Join Model Call'}
                  </button>
               </form>
                           <p className="text-gray-600 text-center text-xs">
               Already have an account? <a href="/login" className="text-black font-medium hover:underline">Log In</a>
            </p>
            </div>
         </div>
         <div className={`${status.type === 'success' ? 'block' : 'hidden'} max-w-sm w-full bg-white p-8 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center gap-4 h-fit mt-6 `}>
            <FontAwesomeIcon className='bg-gray-200 p-5 text-lg rounded-full' icon={icons.check}/>
            <p>Welcome {submittedData?.fullName}!</p>
            <p className='text-gray-500'>You've successfully registered as a {submittedData?.role}.</p>
            <div className='w-full flex flex-col gap-2 items-center text-center border-t border-gray-200 pt-4'>
               <p>{submittedData?.role === 'model' ? 'Complete your profile for a better chances of getting picked!' : 'Head over to the Designer Portal to start viewing models!'}</p>
            </div>
            <Link
                  to={submittedData?.role === 'model' ? `/profile/${slugify(submittedData?.fullName || '')}` : '/designer-portal'}
                  state={submittedData?.role === 'model' ? {submittedData} : null}
                  className="w-full bg-black p-3 rounded-sm text-white text-center"
               >
                  {submittedData?.role === 'model' ? 'Complete Profile' : 'Go to Designer Portal'}
            </Link>
         </div>
      </div>
   )
}

export default SignUp
