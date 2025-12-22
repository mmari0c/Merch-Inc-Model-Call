import logo from '../assets/merch-logo.png'

function SignUp() {
   return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-xs sm:text-sm">
         <div className='w-full max-w-5xl flex flex-col gap-10 items-center md:flex-row md:items-center md:gap-16'>
            <div className='w-full md:w-1/2 flex flex-col gap-4 items-center text-center'>
               <img src={logo} alt="Merch Inc Logo" className="w-30 md:w-70 lg:w-90 h-auto" />
            </div>
            <div className='w-full md:w-1/2 flex flex-col gap-5'>
               <div className='text-center md:text-left'>
                  <h1 className='text-xl font-semibold'>Model Call Sign Up</h1>
                  <p className='text-gray-500'>Register as a model or designer to get started.</p>
               </div>
               <div className="bg-white border-2 border-gray-200 p-5 rounded-lg flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1">
                     <label htmlFor="role" className="font-medium">I am a...</label>
                     <select id="role" placeholder="Select Role" className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400">
                        <option value="model">Model</option>
                        <option value="designer">Designer</option>
                     </select>
                  </div>
                  <div className="flex flex-col gap-1">
                     <label htmlFor="fullName" className="font-medium">Full Name</label>
                     <input type="text" id="fullName" className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400"/>
                  </div>

                  <div className="flex flex-col gap-1">
                     <label htmlFor="email" className="font-medium">Email Address</label>
                     <input type="email" id="email" className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400" />
                  </div>

                  <div className="flex flex-col gap-1">
                     <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
                     <input type="text" id="phoneNumber" className="bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sand-400" />
                  </div>
                  <button className="bg-sand-600 text-white p-3 rounded-lg font-medium hover:bg-sand-700 transition-colors" type="submit">Join Model Call</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default SignUp
