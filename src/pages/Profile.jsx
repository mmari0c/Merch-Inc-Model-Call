import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { icons } from '../icons.js'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../client.js'

const slugify = (value) =>
   value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

// Converts "5'8" or "5'8"" to centimeters
const heightToCm = (heightStr) => {
   const match = String(heightStr).match(/(\d+)'(\d+)/)
   if (!match) return null
   const feet = parseInt(match[1], 10)
   const inches = parseInt(match[2], 10)
   return Math.round((feet * 12 + inches) * 2.54)
}

// Converts cm back to ft'in" display string
const cmToHeight = (cm) => {
   if (!cm) return ''
   const totalInches = Math.round(cm / 2.54)
   const feet = Math.floor(totalInches / 12)
   const inches = totalInches % 12
   return `${feet}'${inches}"`
}

const HEIGHT_OPTIONS = (() => {
   const opts = []
   for (let ft = 4; ft <= 7; ft++) {
      const start = ft === 4 ? 8 : 0
      const end = ft === 7 ? 0 : 11
      for (let i = start; i <= end; i++) {
         opts.push(`${ft}'${i}"`)
      }
   }
   return opts
})()

function Profile() {
   const { modelName } = useParams()
   const navigate = useNavigate()
   const location = useLocation()
   const signUpPhone = location.state?.submittedData?.phone || ''

   const [userInfo, setUserInfo] = useState({
      name: '',
      email: '',
      phone: '',
      instagram: '',
      gender: '',
      ethnicity: '',
      height: '',
      weight: '',
   })
   const [photos, setPhotos] = useState([])
   const [fieldErrors, setFieldErrors] = useState({})
   const [photoError, setPhotoError] = useState('')
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [submitError, setSubmitError] = useState('')
   const [profileStatus, setProfileStatus] = useState('incomplete')
   const [userId, setUserId] = useState(null)

   const fileInputRef = useRef(null)
   const photosRef = useRef([])
   const photoSlots = Array.from({ length: 6 })

   // Load current user and existing profile on mount
   useEffect(() => {
      const loadProfile = async () => {
         const { data: { user } } = await supabase.auth.getUser()
         if (!user) {
            navigate('/login')
            return
         }
         setUserId(user.id)

         const meta = user.user_metadata || {}
         const fullName = meta.full_name || `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim()

         setUserInfo((prev) => ({
            ...prev,
            name: fullName,
            email: user.email,
            phone: signUpPhone,
         }))

         // Check for existing profile (edit mode)
         const { data: existing } = await supabase
            .from('models')
            .select('*')
            .eq('mode_id', user.id)
            .maybeSingle()

         if (existing) {
            setProfileStatus('active')
            setUserInfo({
               name: existing.name || fullName,
               email: user.email,
               phone: existing.phone || '',
               instagram: existing.instagram_handle || '',
               gender: existing.gender || '',
               ethnicity: existing.ethnicity || '',
               height: existing.height_cm ? cmToHeight(existing.height_cm) : '',
               weight: existing.weight_lbs ? String(existing.weight_lbs) : '',
            })

            // Load existing photos
            const { data: existingPhotos } = await supabase
               .from('model_photos')
               .select('url, display_order')
               .eq('model_id', user.id)
               .order('display_order')

            if (existingPhotos?.length) {
               setPhotos(existingPhotos.map((p) => ({ url: p.url, isExisting: true })))
            }
         }
      }
      loadProfile()
   }, [navigate, signUpPhone])

   const handleChange = (event) => {
      const { name, value } = event.target
      setUserInfo((prev) => ({ ...prev, [name]: value }))
      if (fieldErrors[name]) {
         setFieldErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const handleAddPhotos = (event) => {
      const files = Array.from(event.target.files || [])
      if (!files.length) return

      setPhotos((prev) => {
         const remainingSlots = Math.max(0, 6 - prev.length)
         const nextPhotos = files.slice(0, remainingSlots).map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isExisting: false,
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
         if (removed[0] && !removed[0].isExisting) {
            URL.revokeObjectURL(removed[0].url)
         }
         return next
      })
   }

   const handleOpenFilePicker = () => {
      if (photos.length >= 6) return
      fileInputRef.current?.click()
   }

   const handleSubmit = async () => {
      setSubmitError('')
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

      if (Object.keys(nextFieldErrors).length || photos.length < 1) return

      const heightCm = heightToCm(userInfo.height)
      if (!heightCm) {
         setFieldErrors((prev) => ({ ...prev, height: "Use format ft'in\" (e.g. 5'8)" }))
         return
      }

      setIsSubmitting(true)

      // Upload new photos to Supabase Storage
      const uploadedUrls = []
      for (let i = 0; i < photos.length; i++) {
         const photo = photos[i]
         if (photo.isExisting) {
            uploadedUrls.push(photo.url)
            continue
         }
         const ext = photo.file.name.split('.').pop()
         const path = `${userId}/${Date.now()}_${i}.${ext}`
         const { error: uploadError } = await supabase.storage
            .from('model-photos')
            .upload(path, photo.file, { upsert: true })

         if (uploadError) {
            setSubmitError(`Photo upload failed: ${uploadError.message}`)
            setIsSubmitting(false)
            return
         }

         const { data: { publicUrl } } = supabase.storage
            .from('model-photos')
            .getPublicUrl(path)
         uploadedUrls.push(publicUrl)
      }

      // Insert or update models row
      const modelData = {
         mode_id: userId,
         name: userInfo.name.trim(),
         email: userInfo.email,
         phone: userInfo.phone.trim(),
         instagram_handle: userInfo.instagram.trim() || null,
         gender: userInfo.gender,
         ethnicity: userInfo.ethnicity,
         height_cm: heightCm,
         weight_lbs: userInfo.weight ? parseInt(userInfo.weight, 10) : null,
         available: true,
      }

      const { error: modelError } = profileStatus === 'active'
         ? await supabase.from('models').update(modelData).eq('mode_id', userId)
         : await supabase.from('models').insert(modelData)

      if (modelError) {
         setSubmitError(modelError.message)
         setIsSubmitting(false)
         return
      }

      // Replace photo rows: delete old, insert new
      await supabase.from('model_photos').delete().eq('model_id', userId)

      const photoRows = uploadedUrls.map((url, i) => ({
         model_id: userId,
         url,
         display_order: i,
      }))
      const { error: photoRowError } = await supabase.from('model_photos').insert(photoRows)
      if (photoRowError) {
         setSubmitError(photoRowError.message)
         setIsSubmitting(false)
         return
      }

      navigate(`/model/${slugify(userInfo.name)}`)
   }

   useEffect(() => {
      photosRef.current = photos
   }, [photos])

   useEffect(() => {
      return () => {
         photosRef.current.forEach((photo) => {
            if (!photo.isExisting) URL.revokeObjectURL(photo.url)
         })
      }
   }, [])

   return (
      <section className="profile-page flex items-center justify-center min-h-screen px-6 py-12 text-xs sm:text-sm">
         <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
            <p className='text-xl font-semibold text-left w-full max-w-3xl border-b border-gray-200 pb-3'>{profileStatus === 'active' ? 'Edit Profile' : 'Complete Profile'}</p>

            <div className='md:max-w-2xl w-full'>
               <div className="grid gap-6 w-full">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                     <div>
                        <h3 className='text-base font-semibold'>Basic Information</h3>
                        <p className='text-gray-500'>Update your details so designers can contact you quickly.</p>
                     </div>
                     <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="name" className='font-medium'>Full Name <span className='text-red-500'>*</span></label>
                           <input
                              type="text"
                              id="name"
                              name="name"
                              value={userInfo.name}
                              onChange={handleChange}
                              className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.name ? 'border border-red-500' : ''}`}
                           />
                           {fieldErrors.name ? <p className="text-xs text-red-600">{fieldErrors.name}</p> : null}
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="email" className='font-medium'>Email Address</label>
                           <input
                              type="email"
                              id="email"
                              name="email"
                              value={userInfo.email}
                              onChange={handleChange}
                              className="bg-gray-200 rounded-lg p-2 focus:outline-none"
                              disabled
                           />
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="phone" className='font-medium'>Phone Number <span className='text-red-500'>*</span></label>
                           <input
                              type="text"
                              id="phone"
                              name="phone"
                              value={userInfo.phone}
                              onChange={handleChange}
                              className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.phone ? 'border border-red-500' : ''}`}
                              placeholder='469-555-1234'
                           />
                           {fieldErrors.phone ? <p className="text-xs text-red-600">{fieldErrors.phone}</p> : null}
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="instagram" className='font-medium'>Instagram</label>
                           <input type="text" id="instagram" name="instagram" value={userInfo.instagram} onChange={handleChange} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black' placeholder='@handle' />
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="gender" className='font-medium'>Gender <span className='text-red-500'>*</span></label>
                           <select
                              id="gender"
                              name="gender"
                              value={userInfo.gender}
                              onChange={handleChange}
                              className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.gender ? 'border border-red-500' : ''}`}
                           >
                              <option value="" disabled hidden>Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="non-binary">Non-binary</option>
                              <option value="other">Other</option>
                           </select>
                           {fieldErrors.gender ? <p className="text-xs text-red-600">{fieldErrors.gender}</p> : null}
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="ethnicity" className='font-medium'>Ethnicity <span className='text-red-500'>*</span></label>
                           <select
                              id="ethnicity"
                              name="ethnicity"
                              value={userInfo.ethnicity}
                              onChange={handleChange}
                              className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.ethnicity ? 'border border-red-500' : ''}`}
                           >
                              <option value="" disabled hidden>Select Ethnicity</option>
                              <option value="hispanic/latino">Hispanic/Latino</option>
                              <option value="black/african american">Black/African American</option>
                              <option value="white/caucasian">White/Caucasian</option>
                              <option value="asian">Asian</option>
                              <option value="middle eastern">Middle Eastern</option>
                              <option value="native american">Native American</option>
                              <option value="native hawaiian/pacific islander">Native Hawaiian/Pacific Islander</option>
                              <option value="other">Other</option>
                           </select>
                           {fieldErrors.ethnicity ? <p className="text-xs text-red-600">{fieldErrors.ethnicity}</p> : null}
                        </div>
                     </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                     <div>
                        <h3 className='text-base font-semibold'>Photos <span className='text-red-500'>*</span></h3>
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
                              <div key={index} className="relative aspect-square rounded-lg bg-gray-100 overflow-visible">
                                 <div className="h-full w-full overflow-hidden rounded-lg">
                                    <img src={photos[index].url} alt={`Profile photo ${index + 1}`} className="h-full w-full object-cover" />
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
                                 className='relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col gap-2 items-center justify-center hover:bg-gray-50 text-gray-500 md:text-xs'
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
                     {photoError ? <p className="text-xs text-red-600">{photoError}</p> : null}
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                     <div>
                        <h3 className='text-base font-semibold'>Physical Measurements</h3>
                     </div>
                     <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="height" className='font-medium'>Height <span className='text-red-500'>*</span></label>
                           <select
                              id="height"
                              name="height"
                              value={userInfo.height}
                              onChange={handleChange}
                              className={`bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.height ? 'border border-red-500' : ''}`}
                           >
                              <option value="" disabled hidden>Select Height</option>
                              {HEIGHT_OPTIONS.map((h) => (
                                 <option key={h} value={h}>{h}</option>
                              ))}
                           </select>
                           {fieldErrors.height ? <p className="text-xs text-red-600">{fieldErrors.height}</p> : null}
                        </div>
                        <div className='flex flex-col gap-1'>
                           <label htmlFor="weight" className='font-medium'>Weight <span className='text-gray-400'>(lbs)</span></label>
                           <input type="text" id="weight" name='weight' value={userInfo.weight} placeholder="150" onChange={handleChange} className='bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black' />
                        </div>
                     </div>
                  </div>
               </div>

               {submitError ? <p className="mt-2 text-xs text-red-600">{submitError}</p> : null}

               <div className='mt-4 w-full flex gap-4 sm:justify-end sm:gap-2'>
                  {profileStatus === 'active' && (
                     <button type="button" onClick={() => navigate(-1)} className='bg-white border w-full border-gray-500 p-5 cursor-pointer hover:opacity-60 sm:w-fit sm:p-3'>Cancel</button>
                  )}
                  <button
                     type="button"
                     className='bg-black border w-full text-white p-5 cursor-pointer hover:opacity-60 disabled:opacity-40 sm:w-fit sm:p-3'
                     onClick={handleSubmit}
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Saving...' : profileStatus === 'active' ? 'Save' : 'Complete Profile'}
                  </button>
               </div>
            </div>
         </div>
      </section>
   )
}

export default Profile
