import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModelCard from '../components/ModelCard.jsx'
import ModelDetails from '../components/ModelDetails.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
import StarlistPanel from '../components/StarlistPanel.jsx'
import { supabase } from '../client.js'

const cmToHeight = (cm) => {
   if (!cm) return '—'
   const totalInches = Math.round(cm / 2.54)
   const feet = Math.floor(totalInches / 12)
   const inches = totalInches % 12
   return `${feet}'${inches}"`
}

const formatModelNumber = (num) => `M-${String(num).padStart(3, '0')}`

const mapDbModel = (dbModel, coverPhotoUrl, photos) => ({
   id: dbModel.mode_id,
   name: dbModel.name,
   modelNumber: formatModelNumber(dbModel.model_number),
   available: dbModel.available ?? true,
   gender: dbModel.gender || '',
   ethnicity: dbModel.ethnicity || '',
   height: cmToHeight(dbModel.height_cm),
   weight: dbModel.weight_lbs ? `${dbModel.weight_lbs} lbs` : '—',
   instagram: dbModel.instagram_handle || null,
   photos: photos || [],
   coverPhoto: coverPhotoUrl || null,
   isFavorite: false,
   isFinalSelection: false,
})

const STAGE_INFO = {
   registration: { label: 'Registration', description: 'Models and designers are signing up.' },
   model_walk: { label: 'Model Walk', description: 'Designers are reviewing models.' },
   review: { label: 'Review', description: 'Designers are shortlisting and reviewing their favorite models.' },
   final_selection: { label: 'Final Selection', description: 'Selections are being finalized.' },
   end: { label: 'Complete', description: 'The model call has ended.' },
}

function DesignerPortal() {
   const navigate = useNavigate()

   const [modelsList, setModelsList] = useState([])
   const [selectedModel, setSelectedModel] = useState(null)
   const [searchTerm, setSearchTerm] = useState('')
   const [genderFilter, setGenderFilter] = useState([])
   const [ethnicityFilter, setEthnicityFilter] = useState([])
   const [availabilityFilter, setAvailabilityFilter] = useState('all')
   const [isStarlistOpen, setIsStarlistOpen] = useState(false)
   const [stage, setStage] = useState('registration')
   const [designerName, setDesignerName] = useState('')
   const [designerId, setDesignerId] = useState(null)
   const [queue, setQueue] = useState([])
   const [remaining, setRemaining] = useState(0)
   const [hasSubmitted, setHasSubmitted] = useState(false)
   const [isSkipped, setIsSkipped] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [loading, setLoading] = useState(true)

   // Fetch all models with cover photos
   const fetchModels = useCallback(async () => {
      const { data: dbModels } = await supabase.from('models').select('*')
      if (!dbModels) return []

      const { data: coverPhotos } = await supabase
         .from('model_photos')
         .select('model_id, url')
         .eq('display_order', 0)

      const coverMap = {}
      coverPhotos?.forEach((p) => { coverMap[p.model_id] = p.url })

      return dbModels.map((m) => mapDbModel(m, coverMap[m.mode_id] || null, []))
   }, [])

   // Compute how many designers are ahead in the queue
   const computeRemaining = useCallback((designerQueue, myId, submittedIds) => {
      const myIndex = designerQueue.findIndex((d) => d.designer_id === myId)
      if (myIndex < 0) return 0
      const submittedAhead = designerQueue
         .slice(0, myIndex)
         .filter((d) => submittedIds.has(d.designer_id)).length
      return myIndex - submittedAhead
   }, [])

   useEffect(() => {
      let modelCallChannel
      let modelsChannel

      const init = async () => {
         const { data: { user } } = await supabase.auth.getUser()
         if (!user) { navigate('/login'); return }

         // Get designer info
         const { data: designerData } = await supabase
            .from('designer')
            .select('designer_id, name')
            .eq('designer_id', user.id)
            .maybeSingle()

         if (designerData) {
            setDesignerId(designerData.designer_id)
            setDesignerName(designerData.name)
         }

         // Fetch all designers ordered by signup for turn queue
         const { data: allDesigners } = await supabase
            .from('designer')
            .select('designer_id, name, skipped')
            .order('created_at', { ascending: true })

         const designerQueue = allDesigners || []
         setQueue(designerQueue.map((d) => d.name))

         const mySkipped = designerQueue.find((d) => d.designer_id === user.id)?.skipped ?? false
         setIsSkipped(mySkipped)

         // Fetch submitted designer IDs (those who picked at least one model)
         const { data: pickedModels } = await supabase
            .from('models')
            .select('designer_id')
            .not('designer_id', 'is', null)

         const submittedIds = new Set(pickedModels?.map((m) => m.designer_id) || [])
         const skippedIds = new Set(designerQueue.filter((d) => d.skipped).map((d) => d.designer_id))
         const doneIds = new Set([...submittedIds, ...skippedIds])
         setRemaining(computeRemaining(designerQueue, user.id, doneIds))
         setHasSubmitted(submittedIds.has(user.id))

         // Fetch models + designer's starlist
         const mapped = await fetchModels()
         const { data: starlistData } = await supabase
            .from('starlists')
            .select('model_id')
            .eq('designer_id', user.id)
         const starredIds = new Set(starlistData?.map((s) => s.model_id) || [])
         setModelsList(mapped.map((m) => ({ ...m, isFavorite: starredIds.has(m.id) })))

         // Fetch current stage
         const { data: callData } = await supabase
            .from('model_call')
            .select('current_stage')
            .limit(1)
            .single()

         if (callData) {
            setStage(callData.current_stage)
            if (callData.current_stage === 'end') {
               navigate('/confirmation/designer')
               return
            }
         }

         setLoading(false)

         // Realtime: stage changes
         modelCallChannel = supabase
            .channel('designer-model-call')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'model_call' }, (payload) => {
               setStage(payload.new.current_stage)
               if (payload.new.current_stage === 'end') {
                  navigate('/confirmation/designer')
               }
            })
            .subscribe()

         // Realtime: model availability / selections
         modelsChannel = supabase
            .channel('designer-models')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'models' }, async () => {
               // Refetch models and recompute queue
               const updated = await fetchModels()
               setModelsList((prev) =>
                  updated.map((m) => {
                     const existing = prev.find((p) => p.id === m.id)
                     return existing
                        ? { ...m, isFavorite: existing.isFavorite, isFinalSelection: existing.isFinalSelection }
                        : m
                  })
               )

               const { data: pickedNow } = await supabase
                  .from('models')
                  .select('designer_id')
                  .not('designer_id', 'is', null)
               const submittedNow = new Set(pickedNow?.map((m) => m.designer_id) || [])
               setRemaining(computeRemaining(designerQueue, user.id, submittedNow))
               setHasSubmitted(submittedNow.has(user.id))
            })
            .subscribe()
      }

      init()

      return () => {
         if (modelCallChannel) supabase.removeChannel(modelCallChannel)
         if (modelsChannel) supabase.removeChannel(modelsChannel)
      }
   }, [navigate, fetchModels, computeRemaining])

   const filteredModels = useMemo(() => {
      const term = searchTerm.trim().toLowerCase()
      return modelsList.filter((model) => {
         const matchesSearch =
            !term ||
            model.name.toLowerCase().includes(term) ||
            model.modelNumber.toLowerCase().includes(term)
         const matchesGender = genderFilter.length === 0 || genderFilter.includes(model.gender)
         const matchesEthnicity = ethnicityFilter.length === 0 || ethnicityFilter.includes(model.ethnicity)
         const matchesAvailability =
            availabilityFilter === 'all' ||
            (availabilityFilter === 'available' && model.available) ||
            (availabilityFilter === 'unavailable' && !model.available)
         return matchesSearch && matchesGender && matchesEthnicity && matchesAvailability
      })
   }, [modelsList, searchTerm, genderFilter, ethnicityFilter, availabilityFilter])

   const handleSearchChange = (event) => setSearchTerm(event.target.value)

   const handleFilterChange = (event) => {
      const { name, value, checked, type } = event.target
      if (name === 'gender') {
         setGenderFilter((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value))
         return
      }
      if (name === 'ethnicity') {
         setEthnicityFilter((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value))
         return
      }
      if (name === 'availability' && type === 'select-one') setAvailabilityFilter(value)
   }

   const handleClearFilters = () => {
      setGenderFilter([])
      setEthnicityFilter([])
      setAvailabilityFilter('all')
   }

   const handleRemoveFilter = (type, value) => {
      if (type === 'gender') { setGenderFilter((prev) => prev.filter((item) => item !== value)); return }
      if (type === 'ethnicity') { setEthnicityFilter((prev) => prev.filter((item) => item !== value)); return }
      if (type === 'availability') setAvailabilityFilter('all')
   }

   const handleFavoriteToggle = async (modelNumber) => {
      const model = modelsList.find((m) => m.modelNumber === modelNumber)
      if (!model || !designerId) return
      const willFavorite = !model.isFavorite
      setModelsList((prev) =>
         prev.map((m) => m.modelNumber === modelNumber ? { ...m, isFavorite: willFavorite } : m)
      )
      const { error } = willFavorite
         ? await supabase.from('starlists').insert({ designer_id: designerId, model_id: model.id })
         : await supabase.from('starlists').delete().eq('designer_id', designerId).eq('model_id', model.id)
      if (error) {
         // Revert optimistic update on failure
         setModelsList((prev) =>
            prev.map((m) => m.modelNumber === modelNumber ? { ...m, isFavorite: !willFavorite } : m)
         )
      }
   }

   const handleSelectionToggle = (modelNumber) => {
      if (hasSubmitted) return
      setModelsList((prev) =>
         prev.map((m) => m.modelNumber === modelNumber ? { ...m, isFinalSelection: !m.isFinalSelection } : m)
      )
   }

   // Load all photos for a model when opening details
   const handleSelectModel = async (model) => {
      const { data: photos } = await supabase
         .from('model_photos')
         .select('url, display_order')
         .eq('model_id', model.id)
         .order('display_order')

      setSelectedModel({ ...model, photos: photos?.map((p, i) => ({ id: `p${i}`, url: p.url })) || [] })
   }

   const handleSubmitSelection = async () => {
      if (isSubmitting || !designerId || hasSubmitted) return
      setIsSubmitting(true)

      const selected = modelsList.filter((m) => m.isFinalSelection)
      for (const model of selected) {
         await supabase
            .from('models')
            .update({ designer_id: designerId, available: false })
            .eq('mode_id', model.id)
      }

      setIsSubmitting(false)
      navigate('/confirmation/designer')
   }

   const favoriteModels = modelsList.filter((m) => m.isFavorite && m.available)
   const finalSelection = modelsList.filter((m) => m.isFinalSelection)
   const stageInfo = STAGE_INFO[stage] || STAGE_INFO.registration

   if (loading) {
      return (
         <section className="portal designer-portal min-h-screen flex items-center justify-center text-xs sm:text-sm">
            <p className="text-gray-500">Loading...</p>
         </section>
      )
   }

   return (
      <div className="portal designer-portal min-h-screen flex flex-col text-xs sm:text-sm">
         <StageStatus
            label="Current Stage"
            status={stageInfo.label}
            description={stageInfo.description}
            role="designer"
         />
         <section className="flex flex-col items-center justify-center w-[95%] max-w-6xl mx-auto gap-3 md:gap-5 mt-5">

            <div className='flex flex-col w-full gap-6 mb-5 md:flex-row lg:items-start lg:gap-6'>
               <div className='flex flex-col gap-3 md:gap-5 w-full md:w-2/3 lg:w-3/4'>
                  <div className='sticky top-0 z-10 bg-white pt-2 pb-3 flex flex-col gap-4'>
                     <div className='flex justify-between items-center gap-3 w-full'>
                        <div className='w-full relative'>
                           <input
                              className='w-full p-2 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:shadow bg-gray-100'
                              type="text"
                              placeholder='Search by model number or name (e.g, M-001, Mario...)'
                              value={searchTerm}
                              onChange={handleSearchChange}
                           />
                           <FontAwesomeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:hidden' icon={icons.search} />
                        </div>
                        <button
                           type="button"
                           className='flex items-center gap-1 md:hidden'
                           onClick={() => setIsStarlistOpen(true)}
                           aria-label="Open starlist"
                        >
                           {favoriteModels.length > 0 ? (
                              <FontAwesomeIcon className='text-xl text-amber-500' icon={icons.favoriteSolid} />
                           ) : (
                              <FontAwesomeIcon className='text-xl text-black' icon={icons.favorite} />
                           )}
                           <p>{favoriteModels.length}</p>
                        </button>
                     </div>

                     <FiltersPanel
                        genderFilter={genderFilter}
                        ethnicityFilter={ethnicityFilter}
                        availabilityFilter={availabilityFilter}
                        onFilterChange={handleFilterChange}
                        onAvailabilityChange={setAvailabilityFilter}
                        onClearFilters={handleClearFilters}
                        onRemoveFilter={handleRemoveFilter}
                     />
                  </div>

                  <p className='text-gray-600'>{filteredModels.length} models</p>
                  <div className='w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3'>
                     {filteredModels.map((model) => (
                        <ModelCard
                           key={model.modelNumber}
                           model={model}
                           onSelect={() => handleSelectModel(model)}
                           onFavoriteToggle={() => handleFavoriteToggle(model.modelNumber)}
                        />
                     ))}
                  </div>
               </div>

               <div className="flex w-full flex-col gap-4 md:w-1/3 lg:w-1/4">
                  <StarlistPanel
                     favoriteModels={favoriteModels}
                     finalSelection={finalSelection}
                     onSelectionToggle={handleSelectionToggle}
                     isStarlistOpen={isStarlistOpen}
                     onCloseStarlist={() => setIsStarlistOpen(false)}
                     stageStatus={stageInfo.label}
                     queue={queue}
                     profileName={designerName}
                     currentInQueue={queue.indexOf(designerName)}
                     remaining={remaining}
                     hasSubmitted={hasSubmitted}
                     onSubmitSelection={handleSubmitSelection}
                  />
               </div>
            </div>
         </section>

         {selectedModel && (
            <ModelDetails
               selectedModel={selectedModel}
               onClose={() => setSelectedModel(null)}
               onFavoriteToggle={() => handleFavoriteToggle(selectedModel.modelNumber)}
            />
         )}
      </div>
   )
}

export default DesignerPortal
