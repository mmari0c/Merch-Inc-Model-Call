import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function ModelDetails({ selectedModel, onClose, onFavoriteToggle}) {

   const [model, setModel] = useState(selectedModel)

   const handleFavoriteClick = (event) => {
    event.stopPropagation()
    if (onFavoriteToggle) {
      onFavoriteToggle(selectedModel.modelNumber)
      setModel({ ...model, isFavorite: !model.isFavorite } )
    }
   }

   return (
   <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-xs sm:text-sm' onClick={() => onClose()}>
        <div className='bg-white rounded-xl p-6 max-w-lg w-full relative shadow-2xl m-4' onClick={(e) => e.stopPropagation()}>
          <h3 className='font-semibold mb-1'>{model.name.charAt(0).toUpperCase() + model.name.slice(1)}</h3>
          <p className='text-gray-600 mb-4'>#{model.modelNumber}</p>
          <button className='absolute top-3 right-3 text-gray-600 hover:text-gray-700' aria-label='Close details' onClick={() => onClose()}>
            ✕
          </button>
          <div className='w-full h-80 bg-gray-100 rounded-xl mb-4' aria-hidden="true" />

         <div className='flex flex-col gap-2'>
         <div className='grid grid-cols-2 gap-4 '> 
            <div>
               <label className='text-gray-600'>Gender</label>
               <p className='font-medium'>{model.gender.charAt(0).toUpperCase() + model.gender.slice(1)}</p>
            </div>
            <div>
               <label className='text-gray-600'>Ethnicity</label>
               <p className='font-medium'>{model.ethnicity.charAt(0).toUpperCase() + model.ethnicity.slice(1)}</p>
            </div>
            <div>
               <label className='text-gray-600'>Height</label>
               <p className='font-medium'>{model.height}</p>
            </div>
            <div>
               <label className='text-gray-600'>Weight</label>
               <p className='font-medium'>{model.weight}</p>
            </div>
            <div>
               <label className='text-gray-600'>Measurements</label>
               <p className='font-medium'> 
                  {model.measurements.bust && `Bust: ${model.measurements.bust} `}
                  {model.measurements.chest && `Chest: ${model.measurements.chest} `}
                  {model.measurements.waist && `Waist: ${model.measurements.waist} `}
                  {model.measurements.hips && `Hips: ${model.measurements.hips}`}
               </p>
            </div>
         </div> 

          </div>
          <div className='mt-6 flex gap-3'>
            <button
              className={`mt-auto w-full${selectedModel.available ? '' : ' opacity-50 cursor-not-allowed'} bg-black border  py-2 rounded-lg hover:bg-black/90 transition-colors flex items-center justify-center gap-2 text-white`}
              onClick={handleFavoriteClick}
              disabled={!selectedModel.available}
            >
              {selectedModel.available ? (
                <>
                  <FontAwesomeIcon
                    icon={model.isFavorite ? icons.favoriteSolid : icons.favorite}
                  />
                  {model.isFavorite ? 'Starred' : 'Add to Starlist'}
                </>
              ) : (
                'Unavailable'
              )}
            </button>
          </div>
        </div>
      </div>
   )
}

export default ModelDetails
