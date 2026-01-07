import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function finalSelection({ index, name, modelNumber, finalSelectionToggle }) {
   return (
      <div className="bg-green-100 p-4 rounded-lg border border-green-200 flex items-center gap-3 justify-between md:flex-col lg:flex-row">
         <div className="flex items-center gap-3">
            <p>{index + 1}.</p>
            <div className="flex flex-col">
               <p>{name}</p>
               <span className="text-gray-500">#{modelNumber}</span>
            </div>
         </div>
         <button className="py-2 px-4 rounded-lg hover:bg-red-100 hover:border-red-200 transition-colors md:w-full bg-green-100 md:border md:border-green-200  lg:w-auto lg:border-none" onClick={finalSelectionToggle}>
            <FontAwesomeIcon className='text-[0.7rem]' icon={icons.close} />
         </button>
      </div>
   )
}

export default finalSelection