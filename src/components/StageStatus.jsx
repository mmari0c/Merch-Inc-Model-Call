import { useState } from 'react'
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
  const normalizedStatus = String(status || '').toLowerCase().replace(/\s+/g, '-')
  const showDesignerInstructions =
    role === 'designer' &&
    (normalizedStatus === 'selection' || normalizedStatus === 'final-selection')
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)

  const handleInstructionsToggle = () => {
    setIsInstructionsOpen((prev) => !prev)
  }
  const handleInstructionsClose = () => {
    setIsInstructionsOpen(false)
  }
  return (
    <div className="bg-white p-5 rounded-xl border-2 border-gray-200 flex flex-col gap-4 text-xs sm:text-sm">
      <div className="relative flex flex-row justify-between items-center gap-4 md:flex-row md:items-center md:justify-between">
        <div className='flex items-center gap-3'>
          <FontAwesomeIcon className="text-lg lg:text-xl text-gray-500" icon={icons.stageStatus} />
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

        {showDesignerInstructions && (
          <div
            className=""
            onMouseEnter={() => setIsInstructionsOpen(true)}
            onMouseLeave={handleInstructionsClose}
          >
            <button
              type="button"
              className="flex items-center justify-center p-3 text-sand-700"
              onClick={handleInstructionsToggle}
              aria-label="View selection instructions"
            >
              <FontAwesomeIcon className="text-lg lg:text-xl" icon={icons.info} />
            </button>
            {isInstructionsOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={handleInstructionsClose}
                  aria-label="Close instructions"
                />
                <div className="absolute right-0 top-12 z-20 w-72 rounded-lg border border-sand-100 bg-sand-50 p-4 text-sand-900 shadow-lg">
                  <p className="mb-2 font-medium">
                    {normalizedStatus === 'selection'
                      ? 'Selection Instructions'
                      : 'Final Selection Instructions'}
                  </p>
                  {normalizedStatus === 'selection' ? (
                    <ol className="list-decimal space-y-3 pl-5">
                      <li>
                        <p><strong>Review and Star: </strong>Browse available models and click the star to add them to your Starlist. Open a model card to view full details.</p>
                      </li>
                      <li>
                        <p><strong>Wait for Your Turn: </strong>When it is your turn, move your Starlist picks into your final selection.</p>
                      </li>
                      <li>
                        <p><strong>Get Ready: </strong>Keep your Starlist updated so final selections are quick when the stage advances.</p>
                      </li>
                    </ol>
                  ) : (
                    <ol className="list-decimal space-y-3 pl-5">
                      <li>
                        <p><strong>Select from Starlist: </strong>Choose your final models from the Starlist panel.</p>
                      </li>
                      <li>
                        <p><strong>Review Choices: </strong>Double-check model details before confirming your lineup.</p>
                      </li>
                      <li>
                        <p><strong>Submit Final Selection: </strong>Click "Submit Final Selection" to lock in your choices.</p>
                      </li>
                    </ol>
                  )}
                </div>
              </>
            )}
          </div>
        )}

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
