import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import MatchScreen from '../components/MatchScreen.jsx'

function ModelPortal() {

  const model = {
    name: "Mario Nolasco",
    stages: [
      { name: "Selection", status: "current", description: "Designers are selecting models" },
      { name: "Fittings", status: "upcoming", description: "Models are attending fittings" },
      { name: "Photoshoots", status: "upcoming", description: "Models are participating in photoshoots" },
    ],
    modelNumber: "M-001",
    favorites: [
      { designer: "Designer A", isFavorite: true },
      { designer: "Designer B", isFavorite: false },
    ]
  }

  const TEST_DESIGNERS = [
    { name: 'Designer A', contact: 4695551234 },
    { name: 'Designer B', contact: 4695555678 },
  ]

  return (
    <section className="portal model-portal flex items-center justify-center min-h-screen text-xs sm:text-sm">
      <div className="max-w-lg w-full p-6">
        <StageStatus
          label="Current Stage"
          status="Selection"
          description="Designers are selecting models"
          role="model"
        />

        <div className="model-info mt-6 bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col gap-4 items-center">
          {/* PLACEHOLDER INFORMATION */}
          <h1 className="text-xl font-light">{model.name}</h1>
          <p>Model Number: </p>
          <div className='bg-white p-6 rounded-lg border-2 border-dashed border-black w-full text-center text-4xl font-medium'>
            <h2>{model.modelNumber}</h2>
          </div>

          <div className='flex items-center justify-center gap-2 bg-amber-100 p-4 rounded-lg border border-amber-200 w-full'>
            {model.favorites.length > 0 ? (
              <>
                <FontAwesomeIcon className="text-amber-500 text-xl" icon={icons.favoriteSolid} />
                <p>Your profile is on a designer's radar!</p>
              </>
            ) : (
              <>
                <FontAwesomeIcon className="text-amber-500 text-xl" icon={icons.favorite} />
                <p>Your profile is still getting discovered</p>
              </>
            )}
          </div>

                  <div className='flex flex-col gap-2 border-t pt-4 border-t-gray-200'>
         <div className='grid grid-cols-2 gap-4 '> 
            <div>
               <label className='text-gray-600'>Gender</label>
               <p className='font-medium'>Male</p>
            </div>
            <div>
               <label className='text-gray-600'>Ethnicity</label>
               <p className='font-medium'>Hispanic/Latino</p>
            </div>
            <div>
               <label className='text-gray-600'>Height</label>
               <p className='font-medium'>5'8"</p>
            </div>
            <div>
               <label className='text-gray-600'>Weight</label>
               <p className='font-medium'>160 lbs</p>
            </div>
            <div>
               <label className='text-gray-600'>Measurements</label>
               <p className='font-medium'> 
                  Bust: 36"
                  Chest: 38"
                  Waist: 28"
                  Hips: 40"
               </p>
            </div>
            
         </div>
         </div>
            <button
            type="button"
            className='w-full py-2 rounded-sm font-medium bg-black text-white hover:opacity-80 transition-colors flex items-center justify-center gap-2'
          >
            <FontAwesomeIcon icon={icons.pencil} />
            Edit Profile
          </button> 
        </div>
      </div>

      
    </section>
  )
}

export default ModelPortal
