import { useState, useEffect } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModelCard from '../components/ModelCard.jsx'
import ModelDetails from '../components/ModelDetails.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
import StarlistPanel from '../components/StarlistPanel.jsx'

function DesignerPortal() {

  const [modelsList, setModelList] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState([])
  const [ethnicityFilter, setEthnicityFilter] = useState([])
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
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
      const matchesGender =
        genderFilter.length === 0 || genderFilter.includes(model.gender)
      const matchesEthnicity =
        ethnicityFilter.length === 0 ||
        ethnicityFilter.includes(model.ethnicity)
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && model.available) ||
        (availabilityFilter === 'unavailable' && !model.available)
      return (
        matchesSearch &&
        matchesGender &&
        matchesEthnicity &&
        matchesAvailability
      )
    })
    setFilteredModels(filtered)
  }, [modelsList, searchTerm, genderFilter, ethnicityFilter, availabilityFilter])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (event) => {
    const { name, value, checked, type } = event.target
    if (name === 'gender') {
      setGenderFilter((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      )
      return
    }
    if (name === 'ethnicity') {
      setEthnicityFilter((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      )
      return
    }
    if (name === 'availability' && type === 'select-one') {
      setAvailabilityFilter(value)
    }
  }

  const handleClearFilters = () => {
    setGenderFilter([])
    setEthnicityFilter([])
    setAvailabilityFilter('all')
  }

  const handleRemoveFilter = (type, value) => {
    if (type === 'gender') {
      setGenderFilter((prev) => prev.filter((item) => item !== value))
      return
    }
    if (type === 'ethnicity') {
      setEthnicityFilter((prev) => prev.filter((item) => item !== value))
      return
    }
    if (type === 'availability') {
      setAvailabilityFilter('all')
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

  const favoriteModels = modelsList.filter(
    (model) => model.isFavorite && model.available
  )
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
          <div className='sticky top-0 z-10 bg-white pt-2 pb-3 flex flex-col gap-4 md:static md:pt-0 md:pb-0 md:flex-none'>
            <div className='flex justify-between items-center gap-3 w-full'>
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

            <FiltersPanel
              genderFilter={genderFilter}
              ethnicityFilter={ethnicityFilter}
              availabilityFilter={availabilityFilter}
              onFilterChange={handleFilterChange}
              onAvailabilityChange={setAvailabilityFilter}
              onClearFilters={handleClearFilters}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>

          <p className='text-gray-600'>{filteredModels.length} models</p>
          <div className='w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3'>
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
        

        <StarlistPanel
          favoriteModels={favoriteModels}
          finalSelection={finalSelection}
          onSelectionToggle={handleSelectionToggle}
          isStarlistOpen={isStarlistOpen}
          onCloseStarlist={() => setIsStarlistOpen(false)}
        />
      </div>

    </section>
    {selectedModel && (
      <ModelDetails selectedModel={selectedModel} onClose={() => setSelectedModel(null)} onFavoriteToggle={() => handleFavoriteToggle(selectedModel.modelNumber)}  />
    )}
    </>
  )
}

export default DesignerPortal
