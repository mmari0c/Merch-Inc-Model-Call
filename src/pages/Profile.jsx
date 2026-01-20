import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { redirect, useParams } from 'react-router-dom'
import { icons } from '../icons.js'
import { useEffect, useRef, useState } from 'react'

function Profile() {
   const { modelName } = useParams()
   console.log('Model Name from URL:', modelName)

   const profile = {
      name: 'Mario Nolasco',
      modelNumber: 'M-001',
      email: 'marionolasco@gmail.com',
      phone: '469-555-1234',
      available: false,
      instagram: 'mmari0c',
      ethnicity: null,
      gender: null,
      height: null,
      weight: null,
      body: null,
      profileStatus: 'active', // 'active' or 'incomplete'
   }



   const [userInfo, setUserInfo] = useState(profile)
   const [photos, setPhotos] = useState([])
   const [fieldErrors, setFieldErrors] = useState({})
   const [photoError, setPhotoError] = useState('')
   const fileInputRef = useRef(null)
   const photosRef = useRef([])
   const photoSlots = Array.from({ length: 6 })

   const handleChange = (event) => {
      const { name, value } = event.target
      setUserInfo((prev) => ({ ...prev, [name]: value }))
      if (fieldErrors[name]) {
         setFieldErrors((prev) => ({ ...prev, [name]: '' }))
      }
      console.log(userInfo)
   }

   const handleAddPhotos = (event) => {
      const files = Array.from(event.target.files || [])
      if (!files.length) return

      setPhotos((prev) => {
         const remainingSlots = Math.max(0, 6 - prev.length)
         const nextPhotos = files.slice(0, remainingSlots).map((file) => ({
            file,
            url: URL.createObjectURL(file),
         }))
         return [...prev, ...nextPhotos]
      })
      if (photoError) setPhotoError('')

      event.target.value = ''
   }

   const handleRemovePhoto = (index) => {
      setPhotos((prev) => {
         const next = [...prev]
         const removed = next.splice(index, 1)
         if (removed[0]) {
            URL.revokeObjectURL(removed[0].url)
         }
         return next
      })
   }

   const handleOpenFilePicker = () => {
      if (photos.length >= 6) return
      fileInputRef.current?.click()
   }

   const handleSubmit = (event) => {
      event.preventDefault()
      const requiredFields = ['name', 'email', 'phone', 'gender', 'ethnicity', 'height']
      const nextFieldErrors = requiredFields.reduce((acc, field) => {
         const value = userInfo[field]
         if (!value || String(value).trim() === '') {
            acc[field] = 'This field is required.'
         }
         return acc
      }, {})

      setFieldErrors(nextFieldErrors)
      setPhotoError(photos.length < 1 ? 'Add at least 1 photo.' : '')

      if (Object.keys(nextFieldErrors).length || photos.length < 1) {
         return
      }
      // Submit updated profile to Supabase here
      console.log('Profile submitted:', userInfo, photos)
      window.location.href = '/model/mario'
   }

   useEffect(() => {
      photosRef.current = photos
   }, [photos])

   useEffect(() => {
      return () => {
         photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url))
      }
   }, [])

   return (
      <section className="profile-page flex items-center justify-center min-h-screen px-6 py-12 text-xs sm:text-sm">
         <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
            {/* If account is being created, it says "Create Profile", otherwise "Edit Profile" */}
            <p className='text-xl font-semibold text-left w-full max-w-3xl border-b border-gray-200 pb-3 '>{profile.profileStatus === 'active' ? 'Edit Profile' : 'Complete Profile'}</p>

            <div className='md:max-w-2xl w-full'>

            <div className="grid gap-6 w-full">
               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Basic Information</h3>
                     <p className='text-gray-500'>Update your details so designers can contact you quickly.</p>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="name" className='font-medium'>Full Name</label>
                        <input
                           type="text"
                           id="name"
                           name="name"
                           defaultValue={userInfo.name}
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.name ? 'border border-red-500' : ''}`}
                           required
                        />
                        {fieldErrors.name ? (
                           <p className="text-xs text-red-600">{fieldErrors.name}</p>
                        ) : null}
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='font-medium'>Email Address</label>
                        <input
                           type="email"
                           id="email"
                           name="email"
                           defaultValue={userInfo.email}
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.email ? 'border border-red-500' : ''}`}
                           required
                        />
                        {fieldErrors.email ? (
                           <p className="text-xs text-red-600">{fieldErrors.email}</p>
                        ) : null}
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="phone" className='font-medium'>Phone Number</label>
                        <input
                           type="text"
                           id="phone"
                           name="phone"
                           defaultValue={userInfo.phone}
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.phone ? 'border border-red-500' : ''}`}
                           required
                        />
                        {fieldErrors.phone ? (
                           <p className="text-xs text-red-600">{fieldErrors.phone}</p>
                        ) : null}
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="instagram" className='font-medium'>Instagram <span className='text-gray-400'>(Optional)</span></label>
                        <input type="text" id="instagram" name="instagram" defaultValue={userInfo.instagram} onChange={handleChange} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="gender" className='font-medium'>Gender</label>
                        <select
                           id="gender"
                           name="gender"
                           defaultValue={userInfo.gender}
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.gender ? 'border border-red-500' : ''}`}
                           required
                        >
                           <option value="" disabled hidden>Select One</option>
                           <option value="male">Male</option>
                           <option value="female">Female</option>
                           <option value="non-binary">Non-binary</option>
                           <option value="other">Other</option>
                        </select>
                        {fieldErrors.gender ? (
                           <p className="text-xs text-red-600">{fieldErrors.gender}</p>
                        ) : null}
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="ethnicity" className='font-medium'>Ethnicity</label>
                        <select
                           id="ethnicity"
                           name="ethnicity"
                           defaultValue={userInfo.ethnicity}
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.ethnicity ? 'border border-red-500' : ''}`}
                           required
                        >
                           <option value="" disabled hidden>Select One</option>
                           <option value="latino">Hispanic/Latino</option>
                           <option value="black">Black</option>
                           <option value="white">White</option>
                           <option value="asian">Asian</option>
                           <option value="middle eastern">Middle Eastern</option>
                           <option value="native american">Native American</option>
                           <option value="pacific islander">Pacific Islander</option>
                           <option value="other">Other</option>
                        </select>
                        {fieldErrors.ethnicity ? (
                           <p className="text-xs text-red-600">{fieldErrors.ethnicity}</p>
                        ) : null}
                     </div>

                  </div>
               </div>

               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Photos</h3>
                     <p className='text-gray-500'>Add up to 6 photos. Your first photo becomes the profile cover shown to designers.</p>
                  </div>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     multiple
                     onChange={handleAddPhotos}
                     className="hidden"
                  />
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                     {photoSlots.map((_, index) => (
                        photos[index] ? (
                           <div
                              key={index}
                              className="relative aspect-square rounded-lg bg-gray-100 overflow-visible"
                           >
                              <div className="h-full w-full overflow-hidden rounded-lg">
                                 <img
                                    src={photos[index].url}
                                    alt={`Profile photo ${index + 1}`}
                                    className="h-full w-full object-cover"
                                 />
                              </div>
                              <button
                                 type="button"
                                 onClick={() => handleRemovePhoto(index)}
                                 className="absolute -right-2 -top-2 z-10 inline-flex h-4 w-4 items-center p-2 justify-center rounded-full border-2 border-white bg-black text-white shadow"
                              >
                                 <FontAwesomeIcon className='text-[11px] md:text-[10px]' icon={icons.close} />
                              </button>
                              {index === 0 && (
                                 <span className="absolute left-2 bottom-2 rounded-full bg-white px-2 py-1 text-xs font-medium text-black">
                                    Cover
                                 </span>
                              )}
                           </div>
                        ) : (
                           <button
                              key={index}
                              type="button"
                              onClick={handleOpenFilePicker}
                              className='relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col gap-2 items-center justify-center  hover:bg-gray-50 text-gray-500 md:text-xs' 
                           >
                              <span className="relative inline-flex items-center justify-center">
                                 <FontAwesomeIcon icon={icons.camera} className="text-2xl text-black md:text-xl" />
                                 <span className="absolute bottom-3.5 right-4 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-black text-white shadow md:h-3.5 md:w-3.5">
                                    <FontAwesomeIcon icon={icons.plus} className="text-[13px] md:text-[10px]" />
                                 </span>
                                 
                              </span>
                              Add a Photo
                           </button>
                        )
                     ))}
                  </div>
                  {photoError ? (
                     <p className="text-xs text-red-600">{photoError}</p>
                  ) : null}
               </div>

               <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                     <h3 className='text-base font-semibold'>Physical Measurements</h3>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-3'>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="height" className='font-medium'>Height</label>
                        <input
                           type="text"
                           id="height"
                           name='height'
                           placeholder="5'8 or 173cm"
                           onChange={handleChange}
                           className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.height ? 'border border-red-500' : ''}`}
                           required
                        />
                        {fieldErrors.height ? (
                           <p className="text-xs text-red-600">{fieldErrors.height}</p>
                        ) : null}
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="weight" className='font-medium'>Weight <span className='text-gray-400'>(Optional)</span></label>
                        <input type="text" id="weight" name='weight' placeholder="150 lbs or 68 kg" onChange={handleChange} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black' />
                     </div>
                     <div className='flex flex-col gap-1'>
                        <label htmlFor="body" className='font-medium'>Body Measurements <span className='text-gray-400'>(Optional)</span></label>
                        <input type="text" id="body" name='body' placeholder="38-24-36" onChange={handleChange} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black' />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* SUBMIT CHANGES TO SUPABASE AND REROUTE TO MODEL PAGE */}
            <div className='mt-4 w-full flex gap-4 sm:justify-end sm:gap-2'>
               { profile.profileStatus === 'active' && (
                     <button type="button" onClick={() => window.history.back()} className='bg-white border w-full rounded-md border-gray-500 p-5 cursor-pointer hover:opacity-60 sm:w-fit sm:p-3'>Cancel</button>
               )}
               <button type="button" className='bg-black border w-full rounded-md text-white p-5 cursor-pointer hover:opacity-60 sm:w-fit sm:p-3' onClick={handleSubmit}>{profile.profileStatus === 'active' ? 'Save' : 'Complete Profile'}</button>
            </div>

            </div>
         </div>
      </section>
   )
}

export default Profile
