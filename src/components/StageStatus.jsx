import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

function StageStatus({
  label,
  status,
  description,
  role,
  onAdvanceStage,
  nextStageLabel,
  actionLabel,
  isAdvanceDisabled
}) {
  const canControlFlow = typeof onAdvanceStage === 'function'
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col gap-4 text-xs sm:text-sm md:flex-row md:items-center md:justify-between">
      <div className='flex items-center gap-4'>
        <FontAwesomeIcon className="text-xl text-gray-500" icon={icons.stageStatus} />
        <div>
          <p className="mb-2">
            {label}:{' '}
            <span className="bg-sand-100 text-sand-900 rounded-xl px-2 py-1">
              {status}
            </span>
          </p>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>

      {canControlFlow && (
        <div className='flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 md:border-0 md:pt-0'>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
              isAdvanceDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-sand-600 text-white hover:bg-sand-700'
            }`}
            onClick={onAdvanceStage}
            disabled={isAdvanceDisabled}
          >
            {actionLabel || 'Advance Stage'}
          </button>
        </div>
      )}
    </div>
    
  )
}

StageStatus.defaultProps = {
  label: 'Current Stage',
  status: '',
  description: '',
  role: '',
  nextStageLabel: '',
  actionLabel: '',
  isAdvanceDisabled: false
}

export default StageStatus
