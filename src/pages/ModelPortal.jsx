import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../client.js'

const slugify = (value) =>
   value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

const cmToHeight = (cm) => {
   if (!cm) return '—'
   const totalInches = Math.round(cm / 2.54)
   const feet = Math.floor(totalInches / 12)
   const inches = totalInches % 12
   return `${feet}'${inches}"`
}

const STAGE_INFO = {
   registration: { label: 'Registration', description: 'Models and designers are signing up.' },
   model_walk: { label: 'Model Walk', description: 'Designers are reviewing models.' },
   review: { label: 'Review', description: 'Designers are shortlisting and reviewing their favorite models.' },
   final_selection: { label: 'Final Selection', description: 'Selections are being finalized.' },
   end: { label: 'Open Marketplace', description: 'Available models are still being claimed.' },
}

function ModelPortal() {
   const navigate = useNavigate()

   const [model, setModel] = useState(null)
   const [photos, setPhotos] = useState([])
   const [stage, setStage] = useState('registration')
   const [activePhotoIndex, setActivePhotoIndex] = useState(0)
   const [loading, setLoading] = useState(true)
   const [isStarred, setIsStarred] = useState(false)

   useEffect(() => {
      let modelCallChannel
      let modelsChannel
      let starlistChannel

      const init = async () => {
         const { data: { user } } = await supabase.auth.getUser()
         if (!user) {
            navigate('/login')
            return
         }

         // Fetch model profile
         const { data: modelData } = await supabase
            .from('models')
            .select('*')
            .eq('mode_id', user.id)
            .maybeSingle()

         if (!modelData) {
            navigate(`/profile/${slugify(user.user_metadata?.full_name || user.email)}`)
            return
         }

         setModel(modelData)

         // Fetch photos
         const { data: photoData } = await supabase
            .from('model_photos')
            .select('url, display_order')
            .eq('model_id', user.id)
            .order('display_order')

         setPhotos(photoData || [])

         // Fetch current stage
         const { data: callData } = await supabase
            .from('model_call')
            .select('current_stage')
            .limit(1)
            .single()

         if (callData) setStage(callData.current_stage)

         // Check if any designer has starred this model
         const { count } = await supabase
            .from('starlists')
            .select('*', { count: 'exact', head: true })
            .eq('model_id', user.id)
         setIsStarred((count ?? 0) > 0)

         setLoading(false)

         // If model is already selected, go to confirmation
         if (modelData.designer_id) {
            navigate('/confirmation/model')
            return
         }

         // Realtime: stage changes
         modelCallChannel = supabase
            .channel('model-call-stage')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'model_call' }, (payload) => {
               setStage(payload.new.current_stage)
            })
            .subscribe()

         // Realtime: watch for being picked
         modelsChannel = supabase
            .channel('model-picked')
            .on('postgres_changes', {
               event: 'UPDATE',
               schema: 'public',
               table: 'models',
               filter: `mode_id=eq.${user.id}`,
            }, (payload) => {
               if (payload.new.designer_id) {
                  navigate('/confirmation/model')
               }
            })
            .subscribe()

         // Realtime: watch starlist changes for this model
         starlistChannel = supabase
            .channel('model-starlist')
            .on('postgres_changes', {
               event: '*',
               schema: 'public',
               table: 'starlists',
               filter: `model_id=eq.${user.id}`,
            }, async () => {
               const { count: newCount } = await supabase
                  .from('starlists')
                  .select('*', { count: 'exact', head: true })
                  .eq('model_id', user.id)
               setIsStarred((newCount ?? 0) > 0)
            })
            .subscribe()
      }

      init()

      return () => {
         if (modelCallChannel) supabase.removeChannel(modelCallChannel)
         if (modelsChannel) supabase.removeChannel(modelsChannel)
         if (starlistChannel) supabase.removeChannel(starlistChannel)
      }
   }, [navigate])

   const hasMultiplePhotos = photos.length > 1
   const stageInfo = STAGE_INFO[stage] || STAGE_INFO.registration

   const instagramHandle = model?.instagram_handle?.replace(/^@/, '')
   const instagramUrl = instagramHandle ? `https://www.instagram.com/${instagramHandle}` : ''

   const radarBanner = (
      <div className="flex items-center justify-center bg-white p-3 rounded-full h-10 w-10 shadow-sm">
         <FontAwesomeIcon
            className={`text-xl ${isStarred ? 'text-amber-500' : 'text-black'}`}
            icon={isStarred ? icons.favoriteSolid : icons.favorite}
         />
      </div>
   )

   const renderPhoto = (photo, index, className) => (
      <div
         key={index}
         className={`relative rounded-2xl border border-gray-200 aspect-[4.5/5] bg-gray-100 overflow-hidden ${className}`}
      >
         {photo?.url && (
            <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
         )}
         <div className="absolute right-3 bottom-3 md:top-3 md:bottom-auto md:hidden">
            {radarBanner}
         </div>
         {index === 0 && (
            <div className="absolute right-3 top-3 hidden md:block">
               {radarBanner}
            </div>
         )}
      </div>
   )

   const handlePrevPhoto = () => {
      setActivePhotoIndex((i) => (i - 1 + photos.length) % photos.length)
   }

   const handleNextPhoto = () => {
      setActivePhotoIndex((i) => (i + 1) % photos.length)
   }

   if (loading) {
      return (
         <section className="portal model-portal min-h-screen flex items-center justify-center text-xs sm:text-sm">
            <p className="text-gray-500">Loading...</p>
         </section>
      )
   }

   return (
      <section className="portal model-portal min-h-screen flex flex-col text-xs sm:text-sm">
         <StageStatus
            label="Current Stage"
            status={stageInfo.label}
            description={stageInfo.description}
            role="model"
         />
         <div className="max-w-6xl w-full px-6 md:px-4 md:py-8 mx-auto">
            <div className="model-info bg-white">
               <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="flex flex-col gap-4 relative">
                     {/* Mobile carousel */}
                     <div className="relative w-screen -mx-4 sm:-mx-6 md:hidden">
                        {renderPhoto(photos[activePhotoIndex], activePhotoIndex, 'w-full rounded-none')}
                        {hasMultiplePhotos && (
                           <>
                              <button
                                 type="button"
                                 className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/40 p-2 shadow-md transition hover:bg-white"
                                 onClick={handlePrevPhoto}
                                 aria-label="Previous photo"
                              >
                                 <FontAwesomeIcon icon={icons.angleLeft} />
                              </button>
                              <button
                                 type="button"
                                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/40 p-2 shadow-md transition hover:bg-white"
                                 onClick={handleNextPhoto}
                                 aria-label="Next photo"
                              >
                                 <FontAwesomeIcon icon={icons.angleRight} />
                              </button>
                              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                                 {photos.map((_, index) => (
                                    <span
                                       key={index}
                                       className={`h-1.5 w-1.5 rounded-full ${index === activePhotoIndex ? 'bg-white' : 'bg-white/50'} shadow-sm`}
                                    />
                                 ))}
                              </div>
                           </>
                        )}
                     </div>

                     {/* Desktop stack */}
                     <div className="hidden md:flex flex-col gap-4">
                        {photos.map((photo, index) => renderPhoto(photo, index, ''))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-5 md:sticky md:top-6 md:self-start md:max-w-sm">
                     <div className="flex flex-col items-start justify-between gap-2">
                        <div>
                           <h1 className="font-medium text-sm sm:text-md md:text-lg">{model?.name}</h1>
                        </div>
                        <div className="text-gray-600 flex justify-between items-center w-full text-sm sm:text-md md:text-lg">
                           #M-{model?.model_number}
                           {instagramHandle && (
                              <a
                                 className='font-medium text-black inline-flex items-center hover:underline'
                                 href={instagramUrl}
                                 target="_blank"
                                 rel="noreferrer"
                              >
                                 <FontAwesomeIcon icon={icons.instagram} className='text-2xl mr-2' style={{ width: 'auto' }} />
                              </a>
                           )}
                        </div>
                     </div>

                     <div className="flex flex-col gap-4 border-t pt-4 border-t-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-gray-600">Gender</label>
                              <p className="font-medium capitalize">{model?.gender || '—'}</p>
                           </div>
                           <div>
                              <label className="text-gray-600">Ethnicity</label>
                              <p className="font-medium capitalize">{model?.ethnicity || '—'}</p>
                           </div>
                           <div>
                              <label className="text-gray-600">Height</label>
                              <p className="font-medium">{cmToHeight(model?.height_cm)}</p>
                           </div>
                           <div>
                              <label className="text-gray-600">Weight</label>
                              <p className="font-medium">{model?.weight_lbs ? `${model.weight_lbs} lbs` : '—'}</p>
                           </div>
                        </div>
                     </div>

                     <Link
                        className="w-full py-3 font-semibold bg-black text-white hover:opacity-80 transition-colors flex items-center justify-center gap-2"
                        to={`/profile/${slugify(model?.name || '')}`}
                     >
                        <FontAwesomeIcon icon={icons.pencil} />
                        Edit
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default ModelPortal
