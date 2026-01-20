import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MatchScreen from '../components/MatchScreen.jsx'

function ModelPortal() {

  const navigate = useNavigate()

  const model = {
    name: "Mario Nolasco",
    stages: [
      { name: "Selection", status: "current", description: "Designers are selecting models" },
      { name: "Fittings", status: "upcoming", description: "Models are attending fittings" },
      { name: "Photoshoots", status: "upcoming", description: "Models are participating in photoshoots" },
    ],
    modelNumber: "M-001",
    favorites: [],
    isSelected: false,
    instagram: "@mario_nolasco",
  }

  const instagramHandle = model.instagram?.replace(/^@/, '')
  const instagramUrl = instagramHandle ? `https://www.instagram.com/${instagramHandle}` : ''

  const photos = [
    { id: 'p1', className: 'bg-gray-100' },
    { id: 'p2', className: 'bg-gray-100' },
    { id: 'p3', className: 'bg-gray-100' },
    { id: 'p4', className: 'bg-gray-100' },
  ]

  const hasCarousel = photos.length > 2
  const radarBanner = (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
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
  )

  const renderPhoto = (photo, index, className) => (
    <div
      key={photo.id}
      className={`relative rounded-2xl border border-gray-200 aspect-[4/5] ${className} ${photo.className}`}
    >
      {index === 0 && (
        <div className="absolute right-3 bottom-3 lg:top-3 lg:bottom-auto">
          {radarBanner}
        </div>
      )}
    </div>
  )

  const TEST_DESIGNER = { name: 'Designer A', contact: 4695551234 }

  if (model.isSelected) {
    navigate('/confirmation/model', { state: { participants: TEST_DESIGNER } })
  }

  return (
    <section className="portal model-portal min-h-screen text-xs sm:text-sm">
      <div className="max-w-6xl w-full px-4 sm:px-6 py-8 mx-auto">
        <StageStatus
          label="Current Stage"
          status="Selection"
          description="Designers are selecting models"
          role="model"
        />

        <div className="model-info mt-6 bg-white">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4 relative">
              {hasCarousel ? (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory lg:hidden">
                  {photos.map((photo, index) =>
                    renderPhoto(photo, index, 'min-w-[70%] snap-center')
                  )}
                </div>
              ) : (
                null
              )}

              <div className="hidden lg:flex flex-col gap-4">
                {photos.map((photo, index) => renderPhoto(photo, index, ''))}
              </div>
            </div>

            <div className="flex flex-col gap-5  lg:sticky lg:top-6 lg:self-start lg:max-w-sm">
              <div className="flex flex-col items-start justify-between gap-2">
                <div>
                  <h1 className="text-lg font-medium">{model.name}</h1>
                </div>
                <div className="text-lg text-gray-600 flex justify-between items-center w-full">
                  #{model.modelNumber}
                  {instagramHandle ? (
                  <a
                    className='font-medium text-black inline-flex items-center hover:underline'
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={icons.instagram} className='text-2xl mr-2' style={{ width: 'auto' }} />
                  </a>
               ) : (
                  null
               )}
                </div>

  
              </div>
              <div className="flex flex-col gap-4 border-t pt-4 border-t-gray-200 ">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600">Gender</label>
                    <p className="font-medium">Male</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Ethnicity</label>
                    <p className="font-medium">Hispanic/Latino</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Height</label>
                    <p className="font-medium">5'8"</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Weight</label>
                    <p className="font-medium">160 lbs</p>
                  </div>
                </div>
                <div className="">
                  <label className="text-gray-600">Measurements</label>
                  <p className="font-medium">
                    Bust: 36" · Chest: 38" · Waist: 28" · Hips: 40"
                  </p>
                </div>

              </div>
                  <Link className="w-full py-3 rounded-sm font-medium bg-black text-white hover:opacity-80 transition-colors flex items-center justify-center gap-2" to="/profile/mario">
                    <FontAwesomeIcon icon={icons.pencil} />
                    Edit Profile
                </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModelPortal
