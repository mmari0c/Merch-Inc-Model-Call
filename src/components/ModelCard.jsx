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
      className={`${model.available ? 'bg-white' : 'bg-gray-50'} p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400`}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleActivate()
        }
      }}
    >
      <div className="w-full h-100 bg-gray-100 rounded-lg lg:h-50" aria-hidden="true" />
      <div>
        <h3 className="font-medium">{model.name}</h3>
        <p className="text-gray-500">#{model.modelNumber}</p>
      </div>
      
      <p className={`w-full text-center py-2 rounded-lg font-medium ${model.available ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
        {model.available ? 'Available' : 'Unavailable'}
      </p>

      <button
        className="mt-auto w-full bg-white border border-gray-200 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        onClick={handleFavoriteClick}
      >
        {model.available ? (
          <>
            <FontAwesomeIcon icon={model.isFavorite ? icons.favoriteSolid : icons.favorite}/>
            {model.isFavorite ? 'Starred' : 'Add to Starlist'}
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={icons.favorite} />
            Unavailable
          </>
        )}
      </button>
    </div>
  )
}

export default ModelCard
