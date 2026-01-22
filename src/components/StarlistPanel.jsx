import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import Favorites from './Favorites.jsx'
import FinalSelection from './FinalSelection.jsx'
import { useNavigate } from 'react-router-dom'

function StarlistPanel({
  favoriteModels,
  finalSelection,
  onSelectionToggle,
  isStarlistOpen,
  onCloseStarlist,
  stageStatus,
  queue,
  profileName,
  currentInQueue,
}) {
  const navigate = useNavigate()
  const positionInQueue = Array.isArray(queue) ? queue.indexOf(profileName) : -1
  const currentPosition = Number.isInteger(currentInQueue) ? currentInQueue : 0
  const hasQueuePanel = stageStatus === 'Final Selection' && positionInQueue >= 0
  const remaining = 0
  const isMyTurn = hasQueuePanel && remaining <= 0
  const submitLabel = 'Submit Final Selection'

  const submitFinalSelection = () => {
    navigate('/confirmation/designer', { state: { participants: finalSelection } })
  }

  const designer = { 
    name: 'Daniel',
    designerNumber : 'D-001'
   }

  const addSelf = () => {
    null
  }


  return (
    <>
      <div className='hidden sm:sticky md:top-0 md:pt-2 md:flex md:flex-col md:gap-6 w-full'>
        {hasQueuePanel && (
          <div className='bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-2 h-fit items-center text-center'>
            {isMyTurn ? (
              <p className='font-medium text-sand-700'>
                It’s your turn to select!
              </p>
            ) : (
              <p className='flex items-center gap-2'>
                <strong className='text-xl text-sand-600'>{remaining}</strong>
                designers ahead of you
              </p>
            )}
          </div>
        )}
        <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
          <p className='flex items-center gap-2'>
            Starlist{' '}
            <FontAwesomeIcon className='text-amber-500' icon={icons.favoriteSolid} />
          </p>
          <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors' onClick={addSelf}>
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
            <button
              className='rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300'
              disabled={!isMyTurn}
              onClick={submitFinalSelection}
            >
              <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />
              {submitLabel}
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
          <div className='absolute right-0 top-0 h-full w-[78%] max-w-[18rem] bg-white p-5 shadow-xl overflow-y-auto flex flex-col'>
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
                <button
                  className='w-full rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-black/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50 mt-4'
                  disabled={!isMyTurn}
                  onClick={submitFinalSelection}
                >
                  <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />
                  {submitLabel}
                </button>
              </div>
            )}
            {hasQueuePanel && (
              <div className='mt-auto pt-8'>
                <div className='rounded-xl border border-gray-200 bg-white p-4 text-center'>
                {isMyTurn ? (
                  <p className='font-medium text-sand-700'>
                    It’s your turn to select!
                  </p>
                ) : (
                  <p className='flex items-center justify-center gap-2'>
                    <strong className='text-lg text-sand-600'>{remaining}</strong>
                    designers ahead of you
                  </p>
                )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default StarlistPanel
