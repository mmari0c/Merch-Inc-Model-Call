import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import logo from '../assets/merch-inc-logo.png'

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
    role === 'model' ||
    (role === 'designer' && (normalizedStatus === 'review' || normalizedStatus === 'final-selection'))
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)

  const handleInstructionsToggle = () => {
    setIsInstructionsOpen((prev) => !prev)
  }
  const handleInstructionsClose = () => {
    setIsInstructionsOpen(false)
  }
  return (
    <div className="w-full bg-white border-b-2 border-gray-200 px-6 py-4  items-center gap-4 text-xs sm:text-sm">
      <div className="relative flex justify-between items-center gap-4 ml-auto">
        <div className='flex items-center gap-3'>
          <img src={logo} alt="Merch Inc Logo" className="h-20 w-auto shrink-0" />
          <div>
            <p className="mb-1">
              {label}:{' '}
              <span className="bg-gray-100 rounded-xl px-2 py-1">
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
              className="flex items-center justify-center p-3 text-black"
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
                <div className="absolute right-0 top-16 z-20 w-72 rounded-lg border border-gray-100 bg-white p-4 text-sand-900 shadow-lg">
                  <p className="mb-2 font-medium">
                    {role === 'model' ? 'What to Expect' :
                       normalizedStatus === 'review'
                      ? 'Review Instructions'
                      : 'Final Selection Instructions'
                    }
                  </p>
                  {role === 'model' ? (
                    <ol className="list-decimal space-y-3 pl-5">
                      <li>
                        <p><strong>Sit tight: </strong>Designers are browsing profiles. No action needed!</p>
                      </li>
                      <li>
                        <p><strong>Watch your star: </strong>If a designer adds you to their Starlist, the star on your profile will light up in gold.</p>
                      </li>
                      <li>
                        <p><strong>If selected: </strong>Your screen will automatically update letting you know you have been chosen.</p>
                      </li>
                    </ol>
                  ) : (
                    normalizedStatus === 'review' ? (
                      <ol className="list-decimal space-y-3 pl-5">
                        <li>
                          <p><strong>Browse models: </strong>Open a model card to view full details like height, measurements, and photos.</p>
                        </li>
                        <li>
                          <p><strong>Build your starlist: </strong>Click the star on any model you are interested in to save them to your Starlist.</p>
                        </li>
                        <li>
                          <p><strong>Stay ready: </strong>Final Selection is next. Keep your Starlist updated so your picks are ready to go.</p>
                        </li>
                      </ol>
                    ) : (
                      <ol className="list-decimal space-y-3 pl-5">
                        <li>
                          <p><strong>Wait for your turn: </strong>Designers are called in order. Check the queue panel to see your position.</p>
                        </li>
                        <li>
                          <p><strong>Move to final selection: </strong>When it is your turn, click the plus icon next to a Starlist model to add them to your final selection.</p>
                        </li>
                        <li>
                          <p><strong>Submit: </strong>Once you are happy with your choices, click "Submit Final Selection" to lock them in.</p>
                        </li>
                      </ol>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {canControlFlow && (
          <button
            type="button"
            className={`px-4 py-2 rounded-sm text-xs sm:text-sm transition-colors ${
              isAdvanceDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-black/80'
            }`}
            onClick={onAdvanceStage}
            disabled={isAdvanceDisabled}
          >
            {actionLabel || 'Advance Stage'}
          </button>
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
