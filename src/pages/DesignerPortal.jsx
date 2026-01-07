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
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [ethnicityFilter, setEthnicityFilter] = useState('')
  const [isStarlistOpen, setIsStarlistOpen] = useState(false)

  const models = [
    { name: "Mario Nolasco", modelNumber: "M-001", isFavorite: true, isFinalSelection: false, available: true, gender: "male", ethnicity: "latino", height: "6'1\"", weight: "180 lbs", measurements: { chest: "40\"", waist: "32\"", hips: "38\""} },
    { name: "Anna Smith", modelNumber: "M-002", isFavorite: false, isFinalSelection: false, available: true, gender: "female", ethnicity: "caucasian", height: "5'6\"", weight: "140 lbs", measurements: { bust: "34\"", waist: "26\"", hips: "36\"" }},
    { name: "Liam Johnson", modelNumber: "M-003", isFavorite: true, isFinalSelection: false, available: false, gender: "male", ethnicity: "black", height: "5'10\"", weight: "170 lbs", measurements: { chest: "38\"", waist: "30\"", hips: "36\"" } },
    { name: "Sophia Lee", modelNumber: "M-004", isFavorite: false, isFinalSelection: false, available: true, gender: "female", ethnicity: "asian", height: "5'4\"", weight: "120 lbs", measurements: { bust: "32\"", waist: "24\"", hips: "34\"" }},
    { name: "Ethan Brown", modelNumber: "M-005", isFavorite: false, isFinalSelection: false, available: true, gender: "male", ethnicity: "caucasian", height: "6'0\"", weight: "190 lbs", measurements: { chest: "42\"", waist: "34\"", hips: "40\"" } },
  ]

  useEffect( () => {
    // Fetch models from data source
    // For now, using static data
    setModelList(models)
    setFilteredModels(models)
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
    setModelList((prevModels) =>
      prevModels.map((model) =>
        model.modelNumber === modelNumber
          ? { ...model, isFavorite: !model.isFavorite }
          : model
      )
    )
  }

  const handleSelectionToggle = (modelNumber) => {
    setModelList((prevModels) =>
      prevModels.map((model) =>
        model.modelNumber === modelNumber
          ? { ...model, isFinalSelection: !model.isFinalSelection }
          : model
      )
    )
  }

  const favoriteModels = modelsList.filter((model) => model.isFavorite)
  const finalSelection = modelsList.filter((model) => model.isFinalSelection)

  return (
    <>
    <section className="portal designer-portal flex flex-col items-center justify-center w-[95%] max-w-6xl mx-auto gap-3 md:gap-5 text-xs sm:text-sm">

      <div className='w-full mt-5'>
        <StageStatus
          label="Current Stage"
          status="selection"
          description="Designers are selecting models"
          role="designer"
        />
      </div>

      <div className='flex flex-col w-full gap-6 mb-5 md:flex-row lg:items-start lg:gap-6 '>

        <div className='flex flex-col gap-3 md:gap-5 w-full  md:w-2/3 lg:w-3/4'>
          <div className='flex justify-between items-center gap-3 w-full sticky top-0 pt-2 pb-2 z-10 bg-white md:relative md:top-auto md:pt-0 md:pb-0'>
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
              <FontAwesomeIcon className={`text-xl ${favoriteModels.length > 0 ? 'text-amber-500' : 'text-black'}`} icon={icons.favorite} />
              <p>{favoriteModels.length}</p>
            </button>

          </div>


      <div className='flex flex-wrap justify-start gap-3 w-full items-center mb-2 md:mb-0'>
        <select name="gender" id="gender" className='bg-gray-100 rounded-xl p-2' value={genderFilter} onChange={handleFilterChange}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>

        <select name="ethnicity" id="ethnicity" className='bg-gray-100 rounded-xl p-2' value={ethnicityFilter} onChange={handleFilterChange}>
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

          <div className='w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3'>
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
        

        <div className='hidden sm:sticky md:top-6 md:flex md:flex-col md:gap-6 md:w-1/3 lg:w-1/4 lg:max-w-sm'>
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
                isFinalSelection={fav.isFinalSelection}
                finalSelectionToggle={() => handleSelectionToggle(fav.modelNumber)}
              />
            ))}
          </div>

          { finalSelection.length > 0 &&
              <div className='w-full bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 h-fit md:top-6'>
                <p className='flex items-center gap-2'>Final Selection</p>
                {finalSelection.map((fav, index) => (
                  <FinalSelection
                    key={fav.modelNumber}
                    index={index}
                    name={fav.name}
                    modelNumber={fav.modelNumber}
                    finalSelectionToggle={() => handleSelectionToggle(fav.modelNumber)}
                  />
                ))}
                <button className='rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors'>
                  <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />Submit Final Selection
                </button>
              </div>
          }
        </div>    
      </div>

    </section>
    {selectedModel && (
      <ModelDetails selectedModel={selectedModel} onClose={() => setSelectedModel(null)} onFavoriteToggle={() => handleFavoriteToggle(selectedModel.modelNumber)}  />
    )}
    {isStarlistOpen && (
      <div className="fixed text-xs sm:text-sm inset-0 z-50 md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          aria-label="Close starlist"
          onClick={() => setIsStarlistOpen(false)}
        />
        <div className="absolute right-0 top-0 h-full w-[78%] max-w-[18rem] bg-white p-5 shadow-xl overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="flex items-center gap-2">
              Starlist <FontAwesomeIcon className="text-amber-500" icon={icons.favoriteSolid} />
            </p>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setIsStarlistOpen(false)}
            >
              Close
            </button>
          </div>
          <button className='w-full bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors mb-4'>
            Add Self
          </button>
          {favoriteModels.length === 0 && (
            <p className="text-gray-500">No models in your Starlist yet.</p>
          )}
          {favoriteModels.map((fav, index) => (
            <Favorites
              key={fav.modelNumber}
              index={index}
              name={fav.name}
              modelNumber={fav.modelNumber}
              isFinalSelection={fav.isFinalSelection}
              finalSelectionToggle={() => handleSelectionToggle(fav.modelNumber)}
            />
          ))}
          {finalSelection.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="mb-3 font-medium">Final Selection</p>
              {finalSelection.map((fav, index) => (
                <FinalSelection
                  key={fav.modelNumber}
                  index={index}
                  name={fav.name}
                  modelNumber={fav.modelNumber}
                  finalSelectionToggle={() => handleSelectionToggle(fav.modelNumber)}
                />
              ))}
              <button className='w-full rounded-lg bg-black p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mt-4'>
                <FontAwesomeIcon className='text-lg' icon={icons.paperPlane} />Submit Final Selection
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}

export default DesignerPortal
