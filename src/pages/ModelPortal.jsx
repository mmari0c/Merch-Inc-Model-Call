import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'

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

  return (
    <section className="portal model-portal flex items-center justify-center min-h-screen text-xs">
      <div className="max-w-lg w-full p-6">
        <StageStatus
          label="Current Stage"
          status="Selection"
          description="Designers are selecting models"
          role="model"
        />

        <div className="model-info mt-6 bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col gap-4 items-center text-xs">
          {/* PLACEHOLDER INFORMATION */}
          <h1 className="text-xl font-light">{model.name}</h1>
          <p>Model Number: </p>
          <div className='bg-white p-6 rounded-lg border-4 border-gray-200 w-full text-center text-4xl font-medium'>
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

          <button
            type="button"
            className='w-full py-2 rounded-lg font-medium border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2'
          >
            <FontAwesomeIcon icon={icons.pencil} />
            Edit Profile
          </button>

          <div className='text-gray-400 text-left w-full flex items-start gap-2 text-md border-t border-gray-200 pt-4'>
            <FontAwesomeIcon className='' icon={icons.info} />
            <div>
              <p className='font-medium'>What to expect:</p>
              <ul className='list-inside list-disc space-y-1 text-xs'>
                <li>Stay available during the selection stage</li>
                <li>You'll be notified if selected by a designer</li>
                <li>Keep your profile information up to date</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModelPortal
