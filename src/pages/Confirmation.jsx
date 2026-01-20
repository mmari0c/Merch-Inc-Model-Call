import { useLocation, useParams } from 'react-router-dom'
import MatchScreen from '../components/MatchScreen.jsx'

const DESIGNER_PARTICIPANTS = [
  { name: 'Anna Smith', contact: '(469) 555-1201' },
  { name: 'Liam Johnson', contact: '(469) 555-3322' },
]

const MODEL_PARTICIPANTS = [
  { name: 'Designer A', contact: '(469) 555-7788' },
  { name: 'Designer B', contact: '(469) 555-9900' },
]

function Confirmation() {
  const { role } = useParams()
  const location = useLocation()
  const normalizedRole = role === 'model' ? 'model' : 'designer'
  const fallbackParticipants =
    normalizedRole === 'model' ? MODEL_PARTICIPANTS : DESIGNER_PARTICIPANTS
  const stateParticipants = location.state?.participants
  const participants = Array.isArray(stateParticipants) && stateParticipants.length > 0
    ? stateParticipants
    : fallbackParticipants
  const normalizedParticipants = participants.map((participant, index) => ({
    ...participant,
    name: participant.name ?? `Participant ${index + 1}`,
    contact: participant.contact ?? '(469) 555-0000',
  }))

  return (
    <section className='portal flex items-center justify-center min-h-screen text-xs sm:text-sm'>
      <div className='max-w-md w-full p-6'>
        <MatchScreen participants={normalizedParticipants} role={normalizedRole} />
      </div>
    </section>
  )
}

export default Confirmation
