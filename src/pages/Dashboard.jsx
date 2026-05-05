import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import pizzaIcon from "../assets/pizzaIcon.png"
import {HiLogout} from "react-icons/hi";
import "./Dashboard.css"

export default function Dashboard() {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (!session) return null

    return (
        <div className="dashboardWrapper">
            <nav className="topBar">
                <div className="topBarLeft">
                    <img className="dashboardLogo" src={pizzaIcon} alt="pizzaIcon"/>
                    <div className="leftWrapper">
                        <span className="title">A Slice of Time</span>
                        <span className="currentUser">{session.user.email}</span>
                    </div>
                </div>
                <div className="topBarRight">
                    <div className="logoutWrapper">
                        <button
                            className="logoutButton"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <span>
                            <HiLogout/>
                        </span>
                    </div>
                </div>
            </nav>

            <div className="dashboardBody">
                <div className="sideNav">
                    <h1>This is the side bar</h1>
                </div>
            </div>


        </div>
    )
}