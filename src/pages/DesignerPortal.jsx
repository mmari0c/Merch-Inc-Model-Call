import { useState } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModelCard from '../components/ModelCard.jsx'
import Favorites from '../components/Favorites.jsx'

function DesignerPortal() {

  const [selectedModel, setSelectedModel] = useState(null)

  const models = [
    { name: "Mario Nolasco", modelNumber: "M-001", isFavorite: true, available: true },
    { name: "Anna Smith", modelNumber: "M-002", isFavorite: false, available: true },
    { name: "Liam Johnson", modelNumber: "M-003", isFavorite: true, available: false },
    { name: "Sophia Lee", modelNumber: "M-004", isFavorite: false, available: true },
    { name: "Ethan Brown", modelNumber: "M-005", isFavorite: false, available: true },
  ]

  const favorites = models.filter(model => model.isFavorite)

  return (
    <>
    <section className="portal designer-portal flex flex-col items-center justify-center w-[95%] max-w-6xl mx-auto gap-6 text-xs sm:text-sm">
      <div className='w-full mt-5'>
        <StageStatus
          label="Current Stage"
          status="selection"
          description="Designers are selecting models"
          role="designer"
        />
      </div>

      <div className='w-full bg-sand-50 p-6 rounded-xl border-2 border-sand-100 text-sand-900'>
        <p>Selection Instructions</p>
        <ol className='list-decimal space-y-4 m-6'>
          <li>
            <p><strong>Review and Star: </strong>Review all available models and click the star button to add models you're interested in to your Starlist. Click model cards to see complete model information and additional photos</p>
          </li>
          <li>
            <p><strong>Wait for Your Turn: </strong>Once it's your turn in the selection process, you can add models from your Starlist to your final selection.</p>
          </li>
          <li>
            <p><strong>Finalize & Submit: </strong>Choose your final model selections and click "Submit Final Selection" to confirm your choices.</p>
          </li>
        </ol>
      </div>

      

      <div className='flex flex-col w-full gap-6 mb-5 md:flex-row lg:items-start lg:gap-6 '>

        <div className='flex flex-col gap-4 w-full md:w-2/3 lg:w-3/4'>

          <input className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:shadow bg-gray-100' type="text" placeholder='Search by model number or name (e.g, M-001, Mario...)' />

      <div className='flex flex-wrap justify-start gap-3 w-full items-center'>
       <FontAwesomeIcon className='text-lg' icon={icons.filter} />
        <p>Filters: </p>
        <select name="gender" id="gender" className='bg-gray-100 rounded-lg p-2'>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>

        <select name="ethnicity" id="ethnicity" className='bg-gray-100 rounded-lg p-2'>
          <option value="">All Ethnicities</option>
          <option value="latino">Hispanic/Latino</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="asian">Asian</option>
          <option value="middle eastern">Middle Eastern</option>
          <option value="native american">Native American</option>
          <option value="pacific islander">Pacific Islander</option>
          <option value="other">Other</option>
        </select>
      </div>

          <div className='w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-3'>
            {/* MODEL CARDS GO HERE */}
            {models.map((model) => (
              <ModelCard
                key={model.modelNumber}
                name={model.name}
                modelNumber={model.modelNumber}
                isFavorite={model.isFavorite}
                available={model.available}
                className="sm:w-1/2"
                onSelect={() => setSelectedModel(model)}
              />
            ))}
          </div>

        </div>
        


        <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit sm:sticky md:top-6 md:w-1/3 lg:w-1/4 lg:max-w-sm'>
          <p className='flex items-center gap-2'>Starlist <FontAwesomeIcon className='text-amber-500' icon={icons.favoriteSolid}/></p>
          <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors'>
            Add Self
          </button>
          {favorites.map((fav, index) => (
            <Favorites
              key={fav.modelNumber}
              index={index}
              name={fav.name}
              modelNumber={fav.modelNumber}
            />
          ))}
        </div>
      </div>

    </section>
    {selectedModel && (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-xs md:text-sm' onClick={() => setSelectedModel(null)}>
        <div className='bg-white rounded-xl p-6 max-w-lg w-full relative shadow-2xl m-4' onClick={(e) => e.stopPropagation()}>
          <h3 className='font-semibold mb-1'>{selectedModel.name}</h3>
          <p className='text-gray-500 mb-4'>#{selectedModel.modelNumber}</p>
          <button className='absolute top-3 right-3 text-gray-500 hover:text-gray-700' aria-label='Close details' onClick={() => setSelectedModel(null)}>
            ✕
          </button>
          <div className='w-full h-80 bg-gray-100 rounded-xl mb-4' aria-hidden="true" />

            <div className='flex flex-col gap-2'>

            <p className='flex gap-2 items-center'><strong>Status:</strong><p className={`w-2/5 text-center py-1.5 rounded-lg font-medium sm:w-1/4 ${selectedModel.available ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
        {selectedModel.available ? 'Available' : 'Unavailable'}
      </p></p>  

              <p className='text-gray-600'>More profile details, measurements, and experience highlights would be displayed here.</p>
          </div>
          <div className='mt-6 flex gap-3'>
            <button
              className="mt-auto w-full bg-white border border-gray-200 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              <FontAwesomeIcon icon={selectedModel.isFavorite ? icons.favoriteSolid : icons.favorite} />
              {selectedModel.isFavorite ? 'Starred' : 'Add to Starlist'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default DesignerPortal
