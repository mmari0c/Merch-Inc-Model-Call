import { useState } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import DesignerOrder from '../components/DesignerOrder.jsx'
import Stats from '../components/Stats.jsx'
import { data } from 'react-router'

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
  const currentStage = CAMPAIGN_STAGES[currentStageIndex]
  const nextStage = CAMPAIGN_STAGES[currentStageIndex + 1]

  const handleAdvanceStage = () => {
    if (nextStage) {
      setCurrentStageIndex((prev) => Math.min(prev + 1, CAMPAIGN_STAGES.length - 1))
    }
  }

  return (
    <section className="portal admin-portal flex flex-col items-center justify-center w-[90%] max-w-5xl mx-auto gap-6 text-sm">
      <div className='w-full mt-5'>
        <StageStatus
          label="Current Stage"
          status={currentStage.label}
          description={currentStage.description}
          role="admin"
          onAdvanceStage={handleAdvanceStage}
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
      
    </section>
  )
}

export default AdminPortal
