import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../icons.js';

function FilterItem({ handleSummaryClick, filterTitle, filterOptions, filter, onFilterChange, type }) {
   return (
      <details className='group md:relative' data-filter-dropdown>
         <summary
              className='cursor-pointer list-none px-3 py-2 text-gray-700 w-full flex items-center justify-between border-b border-gray-200 md:rounded-xl md:bg-gray-100 md:border-none md:gap-2'
              onPointerDown={handleSummaryClick}
            >
              {filterTitle}{' '}
              <FontAwesomeIcon
                className='transition-transform group-open:rotate-180'
                icon={icons.caretDown}
              />
            </summary>
            <div className='mt-3 w-full flex flex-col gap-3 md:absolute md:left-0 md:z-10 md:mt-2 md:w-48 md:bg-white md:rounded-xl md:shadow-lg md:border md:border-gray-200 md:pt-3' data-filter-options>
               {filterOptions.map((filterOption) => (
                <label key={filterOption.value} className='flex items-center gap-2 border-b pl-3 border-gray-200 pb-2'>
                  <input
                    type={type || "checkbox"}
                    name={filterTitle.toLowerCase()}
                    value={filterOption.value}
                    checked={filter.includes(filterOption.value)}
                    onChange={ type ? () => onFilterChange(filterOption.value) : onFilterChange}
                  />
                  <span className={filter.includes(filterOption.value) ? 'font-bold' : ''}>{filterOption.label}</span>
                </label>
               ))}
            </div>
          </details>
   )
}

export default FilterItem;
