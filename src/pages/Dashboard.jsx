import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login')
            } else {
                setSession(session)
            }
        })
    }, [])

    if (!session) return null

    return <div>Dashboard</div>
}