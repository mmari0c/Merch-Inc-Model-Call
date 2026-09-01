import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StageStatus from '../components/StageStatus.jsx'
import DesignerOrder from '../components/DesignerOrder.jsx'
import Stats from '../components/Stats.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../icons.js'
import { supabase } from '../client.js'

const CAMPAIGN_STAGES = [
  { key: 'registration', label: 'Registration', description: 'Models and designers are signing up and creating profiles.' },
  { key: 'model_walk', label: 'Model Walk', description: 'Models are walking the runway for initial impressions.' },
  { key: 'review', label: 'Review', description: 'Designers are shortlisting and reviewing their favorite models.' },
  { key: 'final_selection', label: 'Final Selection', description: 'Designers are making their final model choices.' },
  { key: 'end', label: 'End', description: 'The model call process is complete.' },
]

const formatModelNumber = (num) => `M-${String(num).padStart(3, '0')}`
const formatDesignerNumber = (num) => `D-${String(num).padStart(3, '0')}`

function AdminPortal() {
  const navigate = useNavigate()

  const [currentStageKey, setCurrentStageKey] = useState('registration')
  const [modelCallId, setModelCallId] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [selectedLog, setSelectedLog] = useState('Designers')
  const [designers, setDesigners] = useState([])
  const [models, setModels] = useState([])
  const [submittedDesignerIds, setSubmittedDesignerIds] = useState(new Set())
  const [skippedDesignerIds, setSkippedDesignerIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Protect admin route
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin-login')
      return
    }

    let modelsChannel

    const init = async () => {
      // Fetch designers ordered by signup
      const { data: designerData } = await supabase
        .from('designer')
        .select('designer_id, name, designer_number, email, phone, skipped')
        .order('created_at', { ascending: true })
      setDesigners(designerData || [])
      setSkippedDesignerIds(new Set(designerData?.filter((d) => d.skipped).map((d) => d.designer_id) || []))

      // Fetch all models
      const { data: modelData } = await supabase
        .from('models')
        .select('mode_id, model_number, name, email, phone, available, designer_id')
        .order('model_number', { ascending: true })
      setModels(modelData || [])

      // Track which designers have submitted
      const submitted = new Set(
        modelData?.filter((m) => m.designer_id).map((m) => m.designer_id) || []
      )
      setSubmittedDesignerIds(submitted)

      // Fetch current stage
      const { data: callData } = await supabase
        .from('model_call')
        .select('id, current_stage')
        .limit(1)
        .single()

      if (callData) {
        setModelCallId(callData.id)
        setCurrentStageKey(callData.current_stage)
      }

      setLoading(false)

      // Realtime: designer skipped changes
      supabase
        .channel('admin-designers')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'designer' }, async () => {
          const { data: updatedDesigners } = await supabase
            .from('designer')
            .select('designer_id, name, designer_number, email, phone, skipped')
            .order('created_at', { ascending: true })
          setDesigners(updatedDesigners || [])
          setSkippedDesignerIds(new Set(updatedDesigners?.filter((d) => d.skipped).map((d) => d.designer_id) || []))
        })
        .subscribe()

      // Realtime: models picked / availability changes
      modelsChannel = supabase
        .channel('admin-models')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'models' }, async () => {
          const { data: updated } = await supabase
            .from('models')
            .select('mode_id, model_number, name, email, phone, available, designer_id')
            .order('model_number', { ascending: true })
          setModels(updated || [])
          const sub = new Set(updated?.filter((m) => m.designer_id).map((m) => m.designer_id) || [])
          setSubmittedDesignerIds(sub)
        })
        .subscribe()
    }

    init()

    return () => {
      if (modelsChannel) supabase.removeChannel(modelsChannel)
    }
  }, [navigate])

  const currentStageIndex = CAMPAIGN_STAGES.findIndex((s) => s.key === currentStageKey)
  const currentStage = CAMPAIGN_STAGES[currentStageIndex] || CAMPAIGN_STAGES[0]
  const nextStage = CAMPAIGN_STAGES[currentStageIndex + 1]

  // Which designer's turn it currently is (skip over submitted and skipped)
  const currentTurnIndex = designers.findIndex(
    (d) => !submittedDesignerIds.has(d.designer_id) && !skippedDesignerIds.has(d.designer_id)
  )

  const handleSkipDesigner = async (designerId) => {
    const isCurrentlySkipped = skippedDesignerIds.has(designerId)
    const { error } = await supabase
      .from('designer')
      .update({ skipped: !isCurrentlySkipped })
      .eq('designer_id', designerId)
    if (!error) {
      setSkippedDesignerIds((prev) => {
        const next = new Set(prev)
        isCurrentlySkipped ? next.delete(designerId) : next.add(designerId)
        return next
      })
    }
  }

  const handleResetEvent = async () => {
    setIsResetting(true)
    const { error } = await supabase.rpc('reset_event')
    if (error) {
      alert(`Reset failed: ${error.message}`)
      setIsResetting(false)
      return
    }
    setIsResetConfirmOpen(false)
    setIsResetting(false)
    window.location.reload()
  }

  const handleAdvanceRequest = () => { if (nextStage) setIsConfirmOpen(true) }
  const handleCloseConfirm = () => setIsConfirmOpen(false)

  const handleConfirmAdvance = async () => {
    setIsConfirmOpen(false)
    if (!nextStage || !modelCallId) return
    const { error } = await supabase
      .from('model_call')
      .update({ current_stage: nextStage.key })
      .eq('id', modelCallId)
    if (!error) setCurrentStageKey(nextStage.key)
  }

  // Build picks log data from real fetched data
  const picksLogs = useMemo(() => {
    const designerIdToName = Object.fromEntries(designers.map((d) => [d.designer_id, d.name]))

    // Build match rows: group models by designer_id
    const matchMap = {}
    models.filter((m) => m.designer_id).forEach((m) => {
      const name = designerIdToName[m.designer_id] || m.designer_id
      if (!matchMap[name]) matchMap[name] = []
      matchMap[name].push(m.name)
    })

    return {
      Designers: {
        columns: ['Number', 'Name', 'Email', 'Phone'],
        rows: designers.map((d) => ({
          Number: formatDesignerNumber(d.designer_number),
          Name: d.name,
          Email: d.email || '—',
          Phone: d.phone || '—',
        })),
      },
      Models: {
        columns: ['Number', 'Name', 'Email', 'Phone'],
        rows: models.map((m) => ({
          Number: formatModelNumber(m.model_number),
          Name: m.name,
          Email: m.email || '—',
          Phone: m.phone || '—',
        })),
      },
      Matches: {
        columns: ['Designer', 'Models'],
        rows: Object.entries(matchMap).map(([designer, modelNames]) => ({
          Designer: designer,
          Models: modelNames.join(', '),
        })),
      },
    }
  }, [designers, models])

  const activeLog = picksLogs[selectedLog]
  const csvColumns = activeLog?.columns ?? []
  const csvRows = activeLog?.rows ?? []

  const stats = useMemo(() => {
    const totalModels = models.length
    const modelsPicked = models.filter((m) => m.designer_id).length
    const availableModels = models.filter((m) => m.available).length
    const participatingDesigners = designers.length
    return [
      { data: String(totalModels), description: 'Total Models' },
      { data: String(modelsPicked), description: 'Models Picked' },
      { data: String(availableModels), description: 'Models Available' },
      { data: String(participatingDesigners), description: 'Participating Designers' },
    ]
  }, [models, designers])

  const formatCsvValue = (value) => {
    if (value === null || value === undefined) return '""'
    return `"${String(value).replace(/"/g, '""')}"`
  }

  const buildCsv = (columns, rows) => {
    const header = columns.map(formatCsvValue).join(',')
    const body = rows.map((row) => columns.map((col) => formatCsvValue(row[col])).join(','))
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

  if (loading) {
    return (
      <section className="portal admin-portal min-h-screen flex items-center justify-center text-sm">
        <p className="text-gray-500">Loading...</p>
      </section>
    )
  }

  return (
    <div className="portal admin-portal h-screen flex flex-col text-sm">
      <StageStatus
        label="Current Stage"
        status={currentStage.label}
        description={currentStage.description}
        role="admin"
        onAdvanceStage={handleAdvanceRequest}
        nextStageLabel={nextStage ? nextStage.label : 'Campaign Complete'}
        actionLabel={nextStage ? `Next: ${nextStage.label}` : 'All Stages Complete'}
        isAdvanceDisabled={!nextStage}
      />
      <div className='flex flex-col items-center w-[90%] max-w-6xl mx-auto gap-6 mt-6 flex-1'>
        <div className='w-full flex justify-end'>
          <button
            type='button'
            className='px-4 py-2 rounded-sm border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors'
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Reset Event
          </button>
        </div>

      <div className='w-full flex-1 flex flex-col gap-5 md:flex-row md:justify-between'>
        <div className='bg-white p-6 rounded-xl border-2 border-gray-200 w-full flex flex-col gap-4 overflow-y-auto'>
          <h2>Designer Turn Order</h2>
          {designers.map((designer, index) => (
            <DesignerOrder
              key={designer.designer_id}
              name={designer.name}
              turnOrder={index + 1}
              currentTurn={currentTurnIndex + 1}
              isSkipped={skippedDesignerIds.has(designer.designer_id)}
              isSubmitted={submittedDesignerIds.has(designer.designer_id)}
              onSkip={() => handleSkipDesigner(designer.designer_id)}
            />
          ))}
        </div>

        <div className='bg-white p-6 rounded-xl border-2 border-gray-200 w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2>Picks Log</h2>
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
                <FontAwesomeIcon icon={icons.download} />
              </button>
            </div>
          </div>
          <div className='overflow-x-auto overflow-y-auto rounded-lg'>
            <table className='w-full text-left text-xs sm:text-sm'>
              <thead className='text-black-600'>
                <tr>
                  {csvColumns.map((column) => (
                    <th key={column} className='px-3 py-2 font-medium'>{column}</th>
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
                    <td colSpan={csvColumns.length || 1} className='px-3 py-6 text-center text-gray-500'>
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
        {stats.map((stat) => (
          <Stats key={stat.description} data={stat.data} description={stat.description} />
        ))}
      </div>

      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-sm">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close confirmation"
            onClick={() => setIsResetConfirmOpen(false)}
          />
          <div
            className="relative w-[90%] max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-base font-semibold">Reset Event</h3>
            <p className="mt-2 text-gray-600">
              This will delete <strong>all models, designers, and accounts</strong> and reset everything back to Registration. This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsResetConfirmOpen(false)}
                disabled={isResetting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleResetEvent}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Reset Event'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          >
            <h3 className="text-base font-semibold">Confirm Stage Change</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to advance to <strong>{nextStage?.label}</strong>? This action affects all active users and cannot be undone.
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
    </div>
    </div>
  )
}

export default AdminPortal
