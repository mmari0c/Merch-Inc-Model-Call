import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function StageStatus({ label, status, description, role }) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col gap-4 text-xs">
      <div className='flex items-center gap-4'>
        <FontAwesomeIcon className="text-xl text-gray-500" icon={icons.stageStatus} />
        <div>
          <p className="mb-2">
            {label}:{' '}
            <span className="bg-purple-100 text-purple-600 rounded-xl px-2 py-1">
              {status}
            </span>
          </p>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>

      {/* MIGHT CHANGE SO THAT THIS APPEARS IN THE SELECTION STAGE FOR DESIGNERS, OR CHANGE IT TO WHERE THIS IS A COMPONENT */}

      {status === 'selection' && role === 'designe' && (
        <div>
          <p className="mb-2">
            {label}:{' '}
            <span className="bg-purple-100 text-purple-600 rounded-xl px-2 py-1">
              {status}
            </span>
          </p>
          <p className="text-gray-500">{description}</p>
        </div>
      )}
    </div>
  )
}

StageStatus.defaultProps = {
  label: 'Current Stage',
  status: '',
  description: '',
}

export default StageStatus
