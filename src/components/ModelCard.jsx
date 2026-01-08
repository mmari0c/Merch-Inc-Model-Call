import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function ModelCard({ model , onSelect, onFavoriteToggle}) {
  const handleActivate = () => {
    if (onSelect) onSelect()
  }

  const handleFavoriteClick = (event) => {
    event.stopPropagation()
    if (onFavoriteToggle) onFavoriteToggle(model.modelNumber)
  }

  return (
    <div
      className={`flex flex-col gap-3 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-violet-400`}
      role="button"
      tabIndex={model.available ? 0 : -1}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleActivate()
        }
      }}
    >
      <div className="relative w-full">
        <img
          className="w-full rounded-lg"
          src="https://fpoimg.com/450x500?text=Preview&bg_color=e6e6e6&text_color=8F8F8F"
          alt=""
        />
        <button
          className="absolute right-2 top-2 bg-noneflex px-2 py-1 text-xl"
          onClick={handleFavoriteClick}
          disabled={!model.available}
          aria-label={model.isFavorite ? 'Unfavorite model' : 'Favorite model'}
        >
          {model.available ? (
            <>
              <FontAwesomeIcon className='text-white' icon={model.isFavorite ? icons.favoriteSolid : icons.favorite}/>
            </>
          ) : (
            <>
              <div className="bg-gray-100 p-2 text-xs bg-opacity-0 rounded-lg flex items-center justify-center ">
                Unavailable
              </div>
            </>
          )}
        </button>
      </div>
      <div>
        <h3 className="font-medium">{model.name}</h3>
        <p className="text-gray-500">#{model.modelNumber}</p>
      </div>
    </div>
  )
}

export default ModelCard
