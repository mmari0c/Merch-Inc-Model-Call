import StageStatus from '../components/StageStatus.jsx'
import { icons } from '../icons.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModelCard from '../components/ModelCard.jsx'

function DesignerPortal() {

  const models = [
    { name: "Mario Nolasco", modelNumber: "M-001", isFavorite: true, available: true },
    { name: "Anna Smith", modelNumber: "M-002", isFavorite: false, available: true },
    { name: "Liam Johnson", modelNumber: "M-003", isFavorite: true, available: false },
    { name: "Sophia Lee", modelNumber: "M-004", isFavorite: false, available: true },
    { name: "Ethan Brown", modelNumber: "M-005", isFavorite: false, available: true },
  ]

  const favorites = models.filter(model => model.isFavorite)

  return (
    <section className="portal designer-portal flex flex-col items-center justify-center w-[90%] max-w-6xl mx-auto gap-6 text-xs">
      <div className='w-full mt-5'>
        <StageStatus
          label="Current Stage"
          status="selection"
          description="Designers are selecting models"
          role="designer"
        />
      </div>

      <div className='w-full bg-violet-50 p-6 rounded-xl border-2 border-gray-200 text-xs text-violet-950'>
        <p>Selection Instructions</p>
        <ol className='list-decimal space-y-4 m-6'>
          <li>
            <p><strong>Review and Star: </strong>Review all available models and click the star button to add models you're interested in to your shortlist. Hover over photos and click "View Profile" to see complete model information and photo carousel.</p>
          </li>
          <li>
            <p><strong>Wait for Your Turn: </strong>Once it's your turn in the selection process, you can add models from your Starlist to your final selection.</p>
          </li>
          <li>
            <p><strong>Finalize & Submit: </strong>Choose your final model selections and click "Submit Final Selection" to confirm your choices.</p>
          </li>
        </ol>
      </div>

      <input className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:shadow' type="text" placeholder='Search by model number or name (e.g, M-001, Mario...)' />

      <div className='flex justify-start gap-3 w-full items-center'>
       <FontAwesomeIcon className='text-lg' icon={icons.filter} />
        <p>Filters: </p>
        <select name="gender" id="gender" className='bg-gray-100 rounded-lg p-2'>
          <option value="">All Genders</option>
          <option value="">Male</option>
          <option value="">Female</option>
          <option value="">Non-binary</option>
        </select>

        <select name="ethnicity" id="ethnicity" className='bg-gray-100 rounded-lg p-2'>
          <option value="">All Ethnicities</option>
          <option value="">Hispanic/Latino</option>
          <option value="">Black</option>
          <option value="">White</option>
          <option value="">Asian</option>
          <option value="">Middle Eastern</option>
          <option value="">Native American</option>
          <option value="">Pacific Islander</option>
          <option value="">Other</option>
        </select>
      </div>

      <div className='w-full flex flex-col gap-5'>
        {/* MODEL CARDS GO HERE */}
        {models.map((model) => (
          <ModelCard
            key={model.modelNumber}
            name={model.name}
            modelNumber={model.modelNumber}
            isFavorite={model.isFavorite}
            available={model.available}
          />
        ))}
      </div>
    </section>
  )
}

export default DesignerPortal
