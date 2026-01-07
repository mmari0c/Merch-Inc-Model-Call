import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function Favorites({ index, name, modelNumber, isFinalSelection, finalSelectionToggle }) {
   
   return (
      <div className={`${isFinalSelection ? 'bg-green-100 border-green-200' : 'bg-white border-gray-200'} p-4 rounded-lg border flex items-center gap-3 justify-between md:flex-col lg:flex-row`}>
         <div className="flex items-center gap-3">
            <p>{index + 1}.</p>
            <div className="flex flex-col">
               <p>{name}</p>
               <span className="text-gray-500">#{modelNumber}</span>
            </div>
         </div>
         <button className={`${isFinalSelection ? 'bg-black text-white hover:bg-gray-700' : 'bg-white border border-gray-200 hover:bg-gray-100'} py-2 px-4 rounded-lg  transition-colors md:w-full lg:w-auto`} onClick={finalSelectionToggle}>
            <FontAwesomeIcon className='text-[0.7rem]' icon={isFinalSelection ? icons.check : icons.plus} />
         </button>
      </div>

   )
}

export default Favorites