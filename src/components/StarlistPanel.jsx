import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import Favorites from './Favorites.jsx'
import FinalSelection from './FinalSelection.jsx'

function StarlistPanel({
  favoriteModels,
  finalSelection,
  onSelectionToggle,
  isStarlistOpen,
  onCloseStarlist,
}) {
  return (
    <>
      <div className='hidden sm:sticky md:top-6 md:flex md:flex-col md:gap-6 md:w-1/3 lg:w-1/4 lg:max-w-sm'>
        <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
          <p className='flex items-center gap-2'>
            Starlist{' '}
            <FontAwesomeIcon className='text-amber-500' icon={icons.favoriteSolid} />
          </p>
          <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors'>
            Add Self
          </button>
          {favoriteModels.length === 0 && (
            <p className='text-gray-500'>You haven't starred anyone yet.</p>
          )}
          {favoriteModels.map((fav, index) => (
            <Favorites
              key={fav.modelNumber}
              index={index}
              name={fav.name}
              modelNumber={fav.modelNumber}
              isFinalSelection={fav.isFinalSelection}
              finalSelectionToggle={() => onSelectionToggle(fav.modelNumber)}
            />
          ))}
        </div>

        {finalSelection.length > 0 && (
          <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
            <p className='flex items-center gap-2'>Final Selection</p>
            {finalSelection.map((fav, index) => (
              <FinalSelection
                key={fav.modelNumber}
                index={index}
                name={fav.name}
                modelNumber={fav.modelNumber}
                finalSelectionToggle={() => onSelectionToggle(fav.modelNumber)}
              />
            ))}
            <button className='rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors'>
              <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />
              Submit Final Selection
            </button>
          </div>
        )}
      </div>

      {isStarlistOpen && (
        <div className='fixed text-xs sm:text-sm inset-0 z-50 md:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40'
            aria-label='Close starlist'
            onClick={onCloseStarlist}
          />
          <div className='absolute right-0 top-0 h-full w-[78%] max-w-[18rem] bg-white p-5 shadow-xl overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <p className='flex items-center gap-2'>
                Starlist{' '}
                <FontAwesomeIcon className='text-amber-500' icon={icons.favoriteSolid} />
              </p>
              <button
                type='button'
                className='text-gray-500 hover:text-gray-800'
                onClick={onCloseStarlist}
              >
                Close
              </button>
            </div>
            <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors mb-4'>
              Add Self
            </button>
            {favoriteModels.length === 0 && (
              <p className='text-gray-500'>You haven't starred anyone yet.</p>
            )}
            {favoriteModels.map((fav, index) => (
              <Favorites
                key={fav.modelNumber}
                index={index}
                name={fav.name}
                modelNumber={fav.modelNumber}
                isFinalSelection={fav.isFinalSelection}
                finalSelectionToggle={() => onSelectionToggle(fav.modelNumber)}
              />
            ))}
            {finalSelection.length > 0 && (
              <div className='mt-6 border-t border-gray-100 pt-4'>
                <p className='mb-3 font-medium'>Final Selection</p>
                {finalSelection.map((fav, index) => (
                  <FinalSelection
                    key={fav.modelNumber}
                    index={index}
                    name={fav.name}
                    modelNumber={fav.modelNumber}
                    finalSelectionToggle={() => onSelectionToggle(fav.modelNumber)}
                  />
                ))}
                <button className='w-full rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mt-4'>
                  <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />
                  Submit Final Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default StarlistPanel
