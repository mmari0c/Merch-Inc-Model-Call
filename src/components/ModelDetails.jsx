import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function ModelDetails({ selectedModel, onClose, onFavoriteToggle}) {

   const [model, setModel] = useState(selectedModel)
   const [activePhotoIndex, setActivePhotoIndex] = useState(0)
   const instagramHandle = model.instagram?.replace(/^@/, '')
   const instagramUrl = instagramHandle ? `https://www.instagram.com/${instagramHandle}` : ''
   const photos = model.photos?.length
      ? model.photos
      : [
         { id: 'p1', className: 'bg-gray-100' },
         { id: 'p2', className: 'bg-gray-100' },
         { id: 'p3', className: 'bg-gray-100' },
         { id: 'p4', className: 'bg-gray-100' },
      ]
   const hasMultiplePhotos = photos.length > 1

   const handleFavoriteClick = (event) => {
    event.stopPropagation()
    if (onFavoriteToggle) {
      onFavoriteToggle(selectedModel.modelNumber)
      setModel({ ...model, isFavorite: !model.isFavorite } )
    }
   }

   const handlePrevPhoto = () => {
      setActivePhotoIndex((index) => (index - 1 + photos.length) % photos.length)
   }

   const handleNextPhoto = () => {
      setActivePhotoIndex((index) => (index + 1) % photos.length)
   }

   const renderPhoto = (photo, className) => (
      <div
         className={`relative w-full h-80 sm:h-96 md:h-[28rem] overflow-hidden ${className} ${photo.className || ''}`}
      >
         {photo.url ? (
            <img
               src={photo.url}
               alt={`${model.name} photo`}
               className="absolute inset-0 h-full w-full object-cover"
            />
         ) : null}
      </div>
   )

   return (
   <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-xs sm:text-sm' onClick={() => onClose()}>
        <div className='bg-white rounded-xl max-w-lg w-full relative shadow-2xl m-4' onClick={(e) => e.stopPropagation()}>
          <button className='absolute top-3 right-3 z-10 text-gray-600 hover:text-gray-700 bg-white/80 rounded-full w-7 h-7 flex items-center justify-center' aria-label='Close details' onClick={() => onClose()}>
            ✕
          </button>
          <div className='px-6 pt-5 pb-3'>
            <h3 className='font-semibold'>{model.name.charAt(0).toUpperCase() + model.name.slice(1)}</h3>
            <p className='text-gray-600'>#{model.modelNumber}</p>
          </div>
          <div className="relative w-full mb-4">
            {renderPhoto(photos[activePhotoIndex], '')}
            {hasMultiplePhotos ? (
               <>
                  <button
                     type="button"
                     className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md transition hover:bg-white"
                     onClick={handlePrevPhoto}
                     aria-label="Previous photo"
                  >
                     <FontAwesomeIcon icon={icons.angleLeft} />
                  </button>
                  <button
                     type="button"
                     className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md transition hover:bg-white"
                     onClick={handleNextPhoto}
                     aria-label="Next photo"
                  >
                     <FontAwesomeIcon icon={icons.angleRight} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                     {photos.map((photo, index) => (
                        <span
                           key={photo.id || `photo-${index}`}
                           className={`h-1.5 w-1.5 rounded-full ${index === activePhotoIndex ? 'bg-white' : 'bg-white/50'} shadow-sm`}
                        />
                     ))}
                  </div>
               </>
            ) : null}
          </div>

         <div className='flex flex-col gap-2 px-6 pb-6'>
            <div className=''>
               {instagramHandle ? (
                  <a
                    className='font-medium text-black inline-flex items-center hover:underline'
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={icons.instagram} className='text-2xl mr-2' style={{ width: 'auto' }} />
                  </a>
               ) : (
                  null
               )}
            </div>
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
         </div> 

          </div>
          <div className='mt-6 flex gap-3 px-6 pb-6'>
            <button
              className={`mt-auto w-full${selectedModel.available ? '' : ' opacity-50 cursor-not-allowed'} bg-black border  py-2 rounded-sm hover:bg-black/90 transition-colors flex items-center justify-center gap-2 text-white`}
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
