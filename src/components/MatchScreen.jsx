import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import MatchItem from './MatchItem.jsx'

function MatchScreen({participants, role}) {
   console.log(participants)
   console.log(role)

   return (
      <div className='w-full bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center gap-4 h-fit mt-6 '>
         <FontAwesomeIcon className='bg-gray-200 p-5 text-lg rounded-full' icon={icons.check}/>
         { role === 'model' ? (
            <div className='text-center'>
               <h2 className='text-lg font-medium'>You've Been Selected!</h2>
               <p className='text-gray-500'>A designer has selected you for their collection</p>
            </div>
         ) : (
            <div className='text-center'>
               <h2 className='text-lg font-medium'>Models Selected!</h2>
               <p className='text-gray-500'>You have successfully selected {participants.length} model{participants.length !== 1 ? 's' : ''} for your collection</p>
            </div>
         )
         }
         {participants.map((participant) => (
            console.log(participant),
            <MatchItem key={participant.name} name={participant.name} phone={participant.contact}/>
         ))}
         <div className='bg-gray-100 p-4 rounded-lg w-full'> 
            { role === 'model' ? (
            <p className='text-center text-gray-600'>Next Steps: Please wait for the designer to contact you with further details.</p>
         ) : (
            <p className='text-center text-gray-600'>Next Steps: Please reach out to the selected models to confirm availability, discuss design concepts, and schedule fittings.</p>
         )}
         </div>
      </div>
   )
}

export default MatchScreen