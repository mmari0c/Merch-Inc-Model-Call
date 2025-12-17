import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function ModelCard({ name, modelNumber, isFavorite, available }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="w-full h-100 bg-gray-100 rounded-lg" aria-hidden="true" />
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500">#{modelNumber}</p>
      </div>

      <p className={`w-full text-center py-2 rounded-lg font-medium ${available ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
        {available ? 'Available' : 'Not Available'}
      </p>

      <button className="mt-auto w-full bg-white border border-gray-200 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={isFavorite ? icons.favoriteSolid : icons.favorite} />
        {isFavorite ? 'Starred' : 'Add to Starlist'}
      </button>
    </div>
  )
}

export default ModelCard
