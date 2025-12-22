import { useState, useEffect } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModelCard from '../components/ModelCard.jsx'
import Favorites from '../components/Favorites.jsx'
import ModelDetails from '../components/ModelDetails.jsx'
import FinalSelection from '../components/FinalSelection.jsx'

function DesignerPortal() {

  const [modelsList, setModelList] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [favoriteModels, setFavoriteModels] = useState([])
  const [finalSelection, setFinalSelection] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [ethnicityFilter, setEthnicityFilter] = useState('')

  const models = [
    { name: "Mario Nolasco", modelNumber: "M-001", isFavorite: true, available: true, gender: "male", ethnicity: "latino", height: "6'1\"", weight: "180 lbs", measurements: { chest: "40\"", waist: "32\"", hips: "38\"" } },
    { name: "Anna Smith", modelNumber: "M-002", isFavorite: false, available: true, gender: "female", ethnicity: "caucasian", height: "5'6\"", weight: "140 lbs", measurements: { bust: "34\"", waist: "26\"", hips: "36\"" } },
    { name: "Liam Johnson", modelNumber: "M-003", isFavorite: true, available: false, gender: "male", ethnicity: "black", height: "5'10\"", weight: "170 lbs", measurements: { chest: "38\"", waist: "30\"", hips: "36\"" } },
    { name: "Sophia Lee", modelNumber: "M-004", isFavorite: false, available: true, gender: "female", ethnicity: "asian", height: "5'4\"", weight: "120 lbs", measurements: { bust: "32\"", waist: "24\"", hips: "34\"" } },
    { name: "Ethan Brown", modelNumber: "M-005", isFavorite: false, available: true, gender: "male", ethnicity: "caucasian", height: "6'0\"", weight: "190 lbs", measurements: { chest: "42\"", waist: "34\"", hips: "40\"" } },
  ]

  useEffect( () => {
    // Fetch models from data source
    // For now, using static data
    setModelList(models)
    setFilteredModels(models)
    setFavoriteModels(models.filter(model => model.isFavorite))
  }, [])

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = modelsList.filter((model) => {
      const matchesSearch =
        !term ||
        model.name.toLowerCase().includes(term) ||
        model.modelNumber.toLowerCase().includes(term)
      const matchesGender = !genderFilter || model.gender === genderFilter
      const matchesEthnicity = !ethnicityFilter || model.ethnicity === ethnicityFilter
      return matchesSearch && matchesGender && matchesEthnicity
    })
    setFilteredModels(filtered)
  }, [modelsList, searchTerm, genderFilter, ethnicityFilter])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    if (name === 'gender') {
      setGenderFilter(value)
      return
    }
    if (name === 'ethnicity') {
      setEthnicityFilter(value)
    }
  }

  const handleFavoriteToggle = (modelNumber) => {
    const updatedModels = modelsList.map((model) => {
      if (model.modelNumber === modelNumber) {
        return { ...model, isFavorite: !model.isFavorite }
      }
      return model
    })
    setModelList(updatedModels)
    setFavoriteModels(updatedModels.filter(model => model.isFavorite))
  }

  const handleFinalSelection = () => {
    // Logic to submit final selection
    alert('Final selection submitted!')
  }

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

          <input
            className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:shadow bg-gray-100'
            type="text"
            placeholder='Search by model number or name (e.g, M-001, Mario...)'
            value={searchTerm}
            onChange={handleSearchChange}
          />

      <div className='flex flex-wrap justify-start gap-3 w-full items-center'>
       <FontAwesomeIcon className='text-lg' icon={icons.filter} />
        <p>Filters: </p>
        <select name="gender" id="gender" className='bg-gray-100 rounded-lg p-2' value={genderFilter} onChange={handleFilterChange}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>

        <select name="ethnicity" id="ethnicity" className='bg-gray-100 rounded-lg p-2' value={ethnicityFilter} onChange={handleFilterChange}>
          <option value="">All Ethnicities</option>
          <option value="latino">Hispanic/Latino</option>
          <option value="black">Black</option>
          <option value="caucasian">White</option>
          <option value="asian">Asian</option>
          <option value="middle eastern">Middle Eastern</option>
          <option value="native american">Native American</option>
          <option value="pacific islander">Pacific Islander</option>
          <option value="other">Other</option>
        </select>
      </div>

          <div className='w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-3'>
            {/* MODEL CARDS GO HERE */}
            {filteredModels.map((model) => (
              <ModelCard
                key={model.modelNumber}
                model={model}
                className="sm:w-1/2"
                onSelect={() => setSelectedModel(model)}
                onFavoriteToggle={() => handleFavoriteToggle(model.modelNumber)}
              />
            ))}
          </div>

        </div>
        

        <div className='sm:sticky w-full top-6 flex flex-col gap-6 md:w-1/3 lg:w-1/4 lg:max-w-sm'>
          <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
            <p className='flex items-center gap-2'>Starlist <FontAwesomeIcon className='text-amber-500' icon={icons.favoriteSolid}/></p>
            <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors'>
              Add Self
            </button>
            {favoriteModels.map((fav, index) => (
              <Favorites
                key={fav.modelNumber}
                index={index}
                name={fav.name}
                modelNumber={fav.modelNumber}
              />
            ))}
          </div>

            <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
              <p className='flex items-center gap-2'>Final Selection</p>
              {favoriteModels.map((fav, index) => (
                <FinalSelection
                  key={fav.modelNumber}
                  index={index}
                  name={fav.name}
                  modelNumber={fav.modelNumber}
                />
              ))}
            </div>
        </div>    
      </div>

    </section>
    {selectedModel && (
      <ModelDetails selectedModel={selectedModel} onClose={() => setSelectedModel(null)} onFavoriteToggle={() => handleFavoriteToggle(selectedModel.modelNumber)}  />
    )}
    </>
  )
}

export default DesignerPortal
