function Profile() {
   const profile = {
      name: 'Mario Nolasco',
      modelNumber: 'M-001',
      email: 'marionolascocortez@gmail.com',
      phone: '469-555-1234',
      available: false,
   }

   const photoSlots = Array.from({ length: 6 })

   return (
      <section className="profile-page flex items-center justify-center min-h-screen px-6 py-12 text-xs sm:text-sm">
         <div className="w-full max-w-5xl flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center gap-4 w-fit md:sticky md:top-12 md:items-start md:h-fit ">
               <div className='flex flex-col items-center gap-4 md:flex-row'>
                  <div className='w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium'>
                     {profile.name?.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                     <h2 className='text-lg font-semibold'>{profile.name}</h2>
                     <p className='text-gray-500'>Model Number: <span className='font-medium text-gray-700'>{profile.modelNumber}</span></p>
                  </div>
               </div>
               <div className='flex flex-col items-center gap-1 text-gray-500 md:items-start'>
                  <p>Email: <span className='text-gray-700 font-medium'>{profile.email}</span></p>
                  <p>Phone: <span className='text-gray-700 font-medium'>{profile.phone}</span></p>
               </div>
               <div className="">
                  <p className={`w-full text-center p-2 rounded-lg font-medium md:text-left ${profile.available ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                  {profile.available ? 'Available' : 'Unavailable'}
                  </p>
               </div>

            </div>

            <div>

            <div className="grid gap-6">
               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Basic Information</h3>
                     <p className='text-gray-500'>Update your details so designers can contact you quickly.</p>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="name" className='font-medium'>Full Name</label>
                        <input type="text" id="name" defaultValue={profile.name} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='font-medium'>Email Address</label>
                        <input type="email" id="email" defaultValue={profile.email} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="phone" className='font-medium'>Phone Number</label>
                        <input type="text" id="phone" defaultValue={profile.phone} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="gender" className='font-medium'>Gender</label>
                        <select id="gender" className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400'>
                           <option value="male">Male</option>
                           <option value="female">Female</option>
                           <option value="non-binary">Non-binary</option>
                           <option value="other">Other</option>
                        </select>
                     </div>
                     <div className='flex flex-col gap-1 sm:col-span-2'>
                        <label htmlFor="ethnicity" className='font-medium'>Ethnicity</label>
                        <select id="ethnicity" className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400'>
                           <option value="latino">Hispanic/Latino</option>
                           <option value="black">Black</option>
                           <option value="white">White</option>
                           <option value="asian">Asian</option>
                           <option value="middle eastern">Middle Eastern</option>
                           <option value="native american">Native American</option>
                           <option value="pacific islander">Pacific Islander</option>
                           <option value="other">Other</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Photos</h3>
                     <p className='text-gray-500'>Add up to 8 photos. Your first photo becomes the profile cover shown to designers.</p>
                  </div>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                     {photoSlots.map((_, index) => (
                        <button
                           key={index}
                           type="button"
                           className='aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50'
                        >
                           + Upload
                        </button>
                     ))}
                  </div>
               </div>

               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Physical Measurements <span className='text-gray-400'>(Optional)</span></h3>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-3'>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="height" className='font-medium'>Height</label>
                        <input type="text" id="height" placeholder="5'8 or 173cm" className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="weight" className='font-medium'>Weight</label>
                        <input type="text" id="weight" placeholder="150 lbs or 68 kg" className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="body" className='font-medium'>Body Measurements</label>
                        <input type="text" id="body" placeholder="38-24-36" className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-400' />
                     </div>
                  </div>
               </div>
            </div>

            <div className='flex justify-end'>
               <button type="button" className='bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors'>Save Profile</button>
            </div>
            </div>
         </div>
      </section>
   )
}

export default Profile
