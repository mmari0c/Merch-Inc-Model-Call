import { useState } from 'react'
import StageStatus from '../components/StageStatus.jsx'
import DesignerOrder from '../components/DesignerOrder.jsx'
import Stats from '../components/Stats.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'

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
  { name: 'Designer A', turnOrder: 1, phoneNumber: '123-456-7890', email: 'designerA@example.com' },
  { name: 'Designer B', turnOrder: 2, phoneNumber: '234-567-8901', email: 'designerB@example.com' },
  { name: 'Designer C', turnOrder: 3, phoneNumber: '345-678-9012', email: 'designerC@example.com' },
  { name: 'Designer D', turnOrder: 4, phoneNumber: '456-789-0123', email: 'designerD@example.com' },
]

const models = [
  { modelNumber: 'M-001', name: 'Model One', phoneNumber: '111-222-3333', email: 'modelOne@example.com' },
  { modelNumber: 'M-002', name: 'Model Two', phoneNumber: '222-333-4444', email: 'modelTwo@example.com' },
  { modelNumber: 'M-003', name: 'Model Three', phoneNumber: '333-444-5555', email: 'modelThree@example.com' },
  { modelNumber: 'M-004', name: 'Model Four', phoneNumber: '444-555-6666', email: 'modelFour@example.com' },
  { modelNumber: 'M-005', name: 'Model Five', phoneNumber: '555-666-7777', email: 'modelFive@example.com' },
]

const matches = [
  { designer: 'Designer A', model: ['Model One'] },
  { designer: 'Designer B', model: ['Model Two'] },
  { designer: 'Designer C', model: ['Model Three', 'Model Four'] },
]

const PICKS_LOGS = {
  Designers: {
    columns: ['Designer', 'Turn Order', 'Phone', 'Email'],
    rows: DESIGNERS.map((designer) => ({
      Designer: designer.name,
      'Turn Order': designer.turnOrder,
      Phone: designer.phoneNumber,
      Email: designer.email,
    })),
  },
  Models: {
    columns: ['Model', 'Model Number', 'Phone', 'Email'],
    rows: models.map((model) => ({
      Model: model.name,
      'Model Number': model.modelNumber,
      Phone: model.phoneNumber,
      Email: model.email,
    })),
  },
  Matches: {
    columns: ['Designer', 'Model'],
    rows: matches.flatMap((match) =>
      match.model.map((modelName) => ({
        Designer: match.designer,
        Model: modelName,
      }))
    ),
  },
}

const STATS = [
  { data: '150', description: 'Total Models' },
  { data: '75', description: 'Models Picked' },
  { data: '30', description: 'Models Available' },
  { data: '20', description: 'Designers Participating' },
]

function AdminPortal() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState('Designers')
  const currentStage = CAMPAIGN_STAGES[currentStageIndex]
  const nextStage = CAMPAIGN_STAGES[currentStageIndex + 1]
  const activeLog = PICKS_LOGS[selectedLog]
  const csvColumns = activeLog?.columns ?? []
  const csvRows = activeLog?.rows ?? []

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

  const formatCsvValue = (value) => {
    if (value === null || value === undefined) {
      return '""'
    }
    return `"${String(value).replace(/"/g, '""')}"`
  }

  const buildCsv = (columns, rows) => {
    const header = columns.map(formatCsvValue).join(',')
    const body = rows.map((row) => columns.map((column) => formatCsvValue(row[column])).join(','))
    return [header, ...body].join('\n')
  }

  const handleDownloadCsv = () => {
    const csvContent = buildCsv(csvColumns, csvRows)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `picks-${selectedLog.toLowerCase()}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2>Picks Log</h2>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <select
              className='bg-white border-gray-200 border p-2 rounded-lg hover:bg-gray-50'
              value={selectedLog}
              onChange={(event) => setSelectedLog(event.target.value)}
            >
              <option>Designers</option>
              <option>Models</option>
              <option>Matches</option>
            </select>
            <button
              type='button'
              className='rounded-lg border border-gray-200 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50'
              onClick={handleDownloadCsv}
            >
              <FontAwesomeIcon icon={icons.download} className='' />
            </button>
          </div>
        </div>
        <div className='overflow-x-auto overflow-y-auto rounded-lg'>
          <table className='w-full text-left text-xs sm:text-sm'>
            <thead className=' text-sand-600'>
              <tr>
                {csvColumns.map((column) => (
                  <th key={column} className='px-3 py-2 font-medium'>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvRows.length > 0 ? (
                csvRows.map((row, rowIndex) => (
                  <tr key={`${selectedLog}-${rowIndex}`}>
                    {csvColumns.map((column) => (
                      <td key={`${selectedLog}-${rowIndex}-${column}`} className='px-3 py-2 border-t border-gray-100'>
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={csvColumns.length || 1}
                    className='px-3 py-6 text-center text-gray-500'
                  >
                    No data available for this log.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
