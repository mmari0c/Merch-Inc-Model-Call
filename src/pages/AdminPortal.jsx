import { useState } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import DesignerOrder from '../components/DesignerOrder.jsx'
import Stats from '../components/Stats.jsx'

const CAMPAIGN_STAGES = [
  {
    key: 'registration',
    label: 'Registration',
    description: 'Models and designers are signing up and creating profiles.'
  },
  {
    key: 'model-walk',
    label: 'Model Walk',
    description: 'Models are walking the runway for initial impressions.'
  },
  {
    key: 'selection',
    label: 'Selection',
    description: 'Designers are shortlisting their favorite models for this campaign.'
  },
  {
    key: 'final-selection',
    label: 'Final Selection',
    description: 'Designers are making their final model choices and confirming their selections.'
  },
  {
    key: 'end',
    label: 'End',
    description: 'The model call process is complete.'
  }
]

const DESIGNERS = [
  { name: 'Designer A', turnOrder: 1 },
  { name: 'Designer B', turnOrder: 2 },
  { name: 'Designer C', turnOrder: 3 },
  { name: 'Designer D', turnOrder: 4 },
]

const STATS = [
  { data: '150', description: 'Total Models' },
  { data: '75', description: 'Models Picked' },
  { data: '30', description: 'Models Available' },
  { data: '20', description: 'Designers Participating' },
]

function AdminPortal() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const currentStage = CAMPAIGN_STAGES[currentStageIndex]
  const nextStage = CAMPAIGN_STAGES[currentStageIndex + 1]

  const handleAdvanceStage = () => {
    if (nextStage) {
      setCurrentStageIndex((prev) => Math.min(prev + 1, CAMPAIGN_STAGES.length - 1))
    }
  }
  const handleAdvanceRequest = () => {
    if (nextStage) {
      setIsConfirmOpen(true)
    }
  }
  const handleConfirmAdvance = () => {
    setIsConfirmOpen(false)
    handleAdvanceStage()
  }
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false)
  }

  return (
    <section className="portal admin-portal flex flex-col items-center justify-center w-[90%] max-w-6xl mx-auto gap-6 text-sm">
      <div className='w-full mt-5'>
        <StageStatus
          label="Current Stage"
          status={currentStage.label}
          description={currentStage.description}
          role="admin"
          onAdvanceStage={handleAdvanceRequest}
          nextStageLabel={nextStage ? nextStage.label : 'Campaign Complete'}
          actionLabel={nextStage ? `Next: ${nextStage?.label}` : 'All Stages Complete'}
          isAdvanceDisabled={!nextStage}
        />
      </div>
    
    <div className='w-full flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
      <div className='bg-white p-6 rounded-xl border-2 border-gray-200 w-full flex flex-col gap-4'>
        <h2>Designer Turn Order</h2>
        {DESIGNERS.map(designer => (
          <DesignerOrder
            key={designer.turnOrder}
            name={designer.name}
            turnOrder={designer.turnOrder}
            currentTurn={1} // Example logic for current turn
          />
        ))}
      </div>

      <div className='bg-white p-6 rounded-xl border-2 border-gray-200 w-full flex flex-col gap-4 h-100'>
        <h2>Picks Log</h2>
        {/* ADD CSV FILE INFORMATION ON HERE */}
        <p>CSV INFO</p>
      </div>
    </div>



    <div className='w-full gap-4 text-center grid grid-cols-2 md:flex md:flex-row mb-5'>
      {STATS.map(stat => (
        <Stats
          key={stat.description}
          data={stat.data}
          description={stat.description}
        />
      ))}
    </div>

    {isConfirmOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center text-sm">
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          aria-label="Close confirmation"
          onClick={handleCloseConfirm}
        />
        <div
          className="relative w-[90%] max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <h3 id="confirm-title" className="text-base font-semibold">Confirm Stage Change</h3>
          <p className="mt-2 text-gray-600">
            Are you sure you want to advance to <strong>{nextStage?.label}</strong>? This action will affect all active users and cannot be undone.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={handleCloseConfirm}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-sm bg-black text-white hover:bg-black/80"
              onClick={handleConfirmAdvance}
            >
              Advance to {nextStage?.label}
            </button>
          </div>
        </div>
      </div>
    )}
    </section>
  )
}

export default AdminPortal
