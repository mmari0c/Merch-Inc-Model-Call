import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
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
    favorites: ["Designer A", "Designer B"],
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

  const hasMultiplePhotos = photos.length > 1
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const radarBanner = (
    <div className="flex items-center justify-center bg-white p-3 rounded-full h-10 w-10 shadow-sm">
      {model.favorites.length > 0 ? (
        <>
          <FontAwesomeIcon className="text-amber-500 text-xl" icon={icons.favoriteSolid} />
        </>
      ) : (
        <>
          <FontAwesomeIcon className="text-black text-xl" icon={icons.favorite} />
        </>
      )}
    </div>
  )

  const renderPhoto = (photo, index, className) => (
    <div
      key={photo.id}
      className={`relative rounded-2xl border border-gray-200 aspect-[4.5/5] ${className} ${photo.className}`}
    >
      <div className="absolute right-3 bottom-3 md:top-3 md:bottom-auto md:hidden">
          {radarBanner}
      </div>

      { index === 0 && (
        <div className="absolute right-3 top-3 hidden md:block">
          {radarBanner}
        </div>
      )
      }
    </div>
  )

  const handlePrevPhoto = () => {
    setActivePhotoIndex((index) => (index - 1 + photos.length) % photos.length)
  }

  const handleNextPhoto = () => {
    setActivePhotoIndex((index) => (index + 1) % photos.length)
  }

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
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4 relative">
              <div className="relative w-screen -mx-4 sm:-mx-6 md:hidden">
                {renderPhoto(photos[activePhotoIndex], activePhotoIndex, 'w-full rounded-none')}
                {hasMultiplePhotos ? (
                  <>
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/40 p-2 shadow-md transition hover:bg-white"
                      onClick={handlePrevPhoto}
                      aria-label="Previous photo"
                    >
                      <FontAwesomeIcon icon={icons.angleLeft} />
                    </button>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/40 p-2 shadow-md transition hover:bg-white"
                      onClick={handleNextPhoto}
                      aria-label="Next photo"
                    >
                      <FontAwesomeIcon icon={icons.angleRight} className='' />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                      {photos.map((photo, index) => (
                        <span
                          key={photo.id}
                          className={`h-1.5 w-1.5 rounded-full ${index === activePhotoIndex ? 'bg-white' : 'bg-white/50'} shadow-sm`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="hidden md:flex flex-col gap-4">
                {photos.map((photo, index) => renderPhoto(photo, index, ''))}
              </div>
            </div>

            <div className="flex flex-col gap-5  md:sticky md:top-6 md:self-start md:max-w-sm">
              <div className="flex flex-col items-start justify-between gap-2">
                <div>
                  <h1 className="font-medium text-sm sm:text-md md:text-lg">{model.name}</h1>
                </div>
                <div className="text-gray-600 flex justify-between items-center w-full text-sm sm:text-md md:text-lg">
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
                    <p className="font-medium">150 lbs</p>
                  </div>
                </div>
                <div className="">
                  <label className="text-gray-600">Measurements</label>
                  <p className="font-medium">
                    Bust: 36" · Chest: 38" · Waist: 28" · Hips: 40"
                  </p>
                </div>

              </div>
                  <Link className="w-full py-3 rounded-sm font-semibold bg-black text-white hover:opacity-80 transition-colors flex items-center justify-center gap-2" to="/profile/mario">
                    <FontAwesomeIcon icon={icons.pencil} />
                    Edit
                </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModelPortal
