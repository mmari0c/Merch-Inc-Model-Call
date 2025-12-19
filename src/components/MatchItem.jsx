import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function MatchItem({name, phone}) {
   return (
      <div className="flex flex-col gap-2 w-full border-t border-gray-100 pt-4">
         <div className='bg-white border-2 border-gray-200 p-4 rounded-lg flex flex-col gap-2'>
            <p className='flex justify-between'>Name: <span className='font-medium'>{name}</span></p>
            <p className='flex justify-between'>Phone: <span className='font-medium'>{phone}</span></p>
         </div>
         <div className='bg-white border-2 border-gray-200 p-4 rounded-lg flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors w-full'>
            <FontAwesomeIcon className='text-lg' icon={icons.message} />
            <p>Contact <span>{name}</span></p>
         </div>
      </div>
   )
}

export default MatchItem