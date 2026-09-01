import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MatchScreen from '../components/MatchScreen.jsx'
import { supabase } from '../client.js'

function Confirmation() {
  const { role } = useParams()
  const normalizedRole = role === 'model' ? 'model' : 'designer'

  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      if (normalizedRole === 'model') {
        // Find which designer picked this model
        const { data: modelData } = await supabase
          .from('models')
          .select('designer_id')
          .eq('mode_id', user.id)
          .maybeSingle()

        if (modelData?.designer_id) {
          const { data: designerData } = await supabase
            .from('designer')
            .select('name, designer_number, phone')
            .eq('designer_id', modelData.designer_id)
            .maybeSingle()

          if (designerData) {
            const label = designerData.designer_number ? `D-${String(designerData.designer_number).padStart(3, '0')}` : ''
            setParticipants([{ name: designerData.name, number: label, contact: designerData.phone || '' }])
          }
        }
      } else {
        // Find which models this designer picked
        const { data: pickedModels } = await supabase
          .from('models')
          .select('name, phone')
          .eq('designer_id', user.id)

        if (pickedModels?.length) {
          setParticipants(pickedModels.map((m) => ({ name: m.name, contact: m.phone || '' })))
        }
      }

      setLoading(false)
    }

    fetchMatches()
  }, [normalizedRole])

  if (loading) {
    return (
      <section className='portal flex items-center justify-center min-h-screen text-xs sm:text-sm'>
        <p className="text-gray-500">Loading...</p>
      </section>
    )
  }

  return (
    <section className='portal flex items-center justify-center min-h-screen text-xs sm:text-sm'>
      <div className='max-w-md w-full p-6'>
        <MatchScreen participants={participants} role={normalizedRole} />
      </div>
    </section>
  )
}

export default Confirmation
