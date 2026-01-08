import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import FilterItem from './FilterItem.jsx'

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
]

const ethnicityOptions = [
  { value: 'latino', label: 'Hispanic/Latino' },
  { value: 'black', label: 'Black' },
  { value: 'caucasian', label: 'White' },
  { value: 'asian', label: 'Asian' },
  { value: 'middle eastern', label: 'Middle Eastern' },
  { value: 'native american', label: 'Native American' },
  { value: 'pacific islander', label: 'Pacific Islander' },
  { value: 'other', label: 'Other' },
]

const availabilityOptions = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  
]

function FiltersPanel({
  genderFilter,
  ethnicityFilter,
  availabilityFilter,
  onFilterChange,
  onAvailabilityChange,
  onClearFilters,
  onRemoveFilter,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('[data-filter-dropdown]')) {
        return
      }
      document.querySelectorAll('[data-filter-dropdown]').forEach((node) => {
        node.removeAttribute('open')
      })
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [])

  const handleSummaryClick = (event) => {
    const current = event.currentTarget.closest('[data-filter-dropdown]')
    document.querySelectorAll('[data-filter-dropdown]').forEach((node) => {
      if (node !== current) {
        node.removeAttribute('open')
      }
    })
  }

  const availabilityOption =
    availabilityOptions.find((option) => option.value === availabilityFilter) ||
    availabilityOptions[0]
  const availabilityLabel = availabilityOption.label
  const isAvailabilityActive = availabilityFilter !== 'all'

  const activeGenderOptions = genderOptions.filter((option) =>
    genderFilter.includes(option.value)
  )
  const activeEthnicityOptions = ethnicityOptions.filter((option) =>
    ethnicityFilter.includes(option.value)
  )
  const hasActiveFilters =
    activeGenderOptions.length > 0 ||
    activeEthnicityOptions.length > 0 ||
    isAvailabilityActive
  const activeTypes = [
    activeGenderOptions.length > 0 ? 'Gender' : null,
    activeEthnicityOptions.length > 0 ? 'Ethnicity' : null,
    isAvailabilityActive ? 'Status' : null,
  ].filter(Boolean)

  return (
    <>
      <button
        type="button"
        className='md:hidden w-full flex items-center gap-4 text-gray-700 rounded-full'
        onClick={() => setIsFilterOpen(true)}
        aria-label="Open filters"
      >
        <span className='relative flex items-center justify-center'>
          <FontAwesomeIcon className='text-gray-500 border rounded-full border-gray-200 p-2' icon={icons.sliders} />
          {hasActiveFilters && (
            <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-sand-500' />
          )}
        </span>
        {activeTypes.length > 0 && (
          <span className='flex flex-wrap gap-2'>
            {activeTypes.map((type) => (
              <span
                key={type}
                className='inline-flex items-center gap-1 rounded-full bg-black px-2 py-1 font-semibold text-white'
              >
                <FontAwesomeIcon icon={icons.check} />
                {type}
              </span>
            ))}
          </span>
        )}
      </button>

      {isFilterOpen && (
        <div className='md:hidden fixed inset-0 z-50 bg-white p-4 flex flex-col gap-3 overflow-y-auto filter-panel-slide'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-xl font-medium'>Filters</p>
            <button
              type="button"
              className='text-gray-500 hover:text-gray-800'
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filters"
            >
              Close
            </button>
          </div>

          <FilterItem
            handleSummaryClick={handleSummaryClick}
            filterTitle="Gender"
            filterOptions={genderOptions}
            filter={genderFilter}
            onFilterChange={onFilterChange}
          />
          
          <FilterItem
            handleSummaryClick={handleSummaryClick}
            filterTitle="Ethnicity"
            filterOptions={ethnicityOptions}
            filter={ethnicityFilter}
            onFilterChange={onFilterChange}
          />
          
          <FilterItem
            handleSummaryClick={handleSummaryClick}
            filterTitle="Status"
            filterOptions={availabilityOptions}
            filter={[availabilityFilter]}
            onFilterChange={onAvailabilityChange}
            type="radio"
          />

          {hasActiveFilters && (
            <div className='flex flex-wrap items-center gap-2 text-xs text-gray-700 mt-4'>
              {activeGenderOptions.map((option) => (
                <button
                  key={`gender-${option.value}`}
                  type="button"
                  className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
                  onClick={() => onRemoveFilter('gender', option.value)}
                >
                  {option.label}
                  <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
                </button>
              ))}
              {activeEthnicityOptions.map((option) => (
                <button
                  key={`ethnicity-${option.value}`}
                  type="button"
                  className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
                  onClick={() => onRemoveFilter('ethnicity', option.value)}
                >
                  {option.label}
                  <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
                </button>
              ))}
              {isAvailabilityActive && (
                <button
                  type="button"
                  className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
                  onClick={() => onRemoveFilter('availability')}
                >
                  {availabilityLabel}
                  <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
                </button>
              )}
              <button
                type="button"
                className='px-1 py-1 text-xs font-medium hover:underline'
                onClick={onClearFilters}
              >
                Clear all
              </button>
            </div>
          )}
          <div className='flex gap-4 mt-auto'>
            <button className='bg-white border w-full rounded-md border-gray-500 p-5 hover:opacity-60' onClick={onClearFilters}>Clear All</button>
            <button className='bg-black border w-full rounded-md text-white p-5 hover:opacity-60' onClick={() => setIsFilterOpen(false)}>View Models</button>
          </div>
        </div>
      )}

      <div className='hidden md:flex flex-wrap justify-start gap-3 w-full items-center mb-2 md:mb-0'>
        <FilterItem
          handleSummaryClick={handleSummaryClick}
          filterTitle="Gender"
          filterOptions={genderOptions}
          filter={genderFilter}
          onFilterChange={onFilterChange}
        />
          
        <FilterItem
          handleSummaryClick={handleSummaryClick}
          filterTitle="Ethnicity"
          filterOptions={ethnicityOptions}
          filter={ethnicityFilter}
          onFilterChange={onFilterChange}
        />
          
        <FilterItem
          handleSummaryClick={handleSummaryClick}
          filterTitle="Status"
          filterOptions={availabilityOptions}
          filter={[availabilityFilter]}
          onFilterChange={onAvailabilityChange}
          type="radio"
        />
      </div>

      {hasActiveFilters && (
        <div className='hidden md:flex flex-wrap items-center gap-2 text-xs text-gray-700'>
          {activeGenderOptions.map((option) => (
            <button
              key={`gender-${option.value}`}
              type="button"
              className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
              onClick={() => onRemoveFilter('gender', option.value)}
            >
              {option.label}
              <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
            </button>
          ))}
          {activeEthnicityOptions.map((option) => (
            <button
              key={`ethnicity-${option.value}`}
              type="button"
              className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
              onClick={() => onRemoveFilter('ethnicity', option.value)}
            >
              {option.label}
              <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
            </button>
          ))}
          {isAvailabilityActive && (
            <button
              type="button"
              className='flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1'
              onClick={() => onRemoveFilter('availability')}
            >
              {availabilityLabel}
              <FontAwesomeIcon className='text-[10px]' icon={icons.close} />
            </button>
          )}
          <button
            type="button"
            className='px-1 py-1 text-xs font-medium hover:underline'
            onClick={onClearFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </>
  )
}

export default FiltersPanel
