import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {supabase} from '../supabaseClient'
import pizzaIcon from "../assets/pizzaIcon.png"
import {HiLogout} from "react-icons/hi";
import "./Dashboard.css"
import {IoSettingsOutline} from "react-icons/io5";
import {FaCalendarAlt} from "react-icons/fa";
import {FaPeopleGroup} from "react-icons/fa6";
import {MdHistory} from "react-icons/md";
import Schedule from "../components/Schedule.jsx";
import Employees from "../components/Employees.jsx";
import History from "../components/History.jsx"
import Settings from "../components/Settings.jsx";

export default function Dashboard() {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('schedule')

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            if (!session) {
                navigate('/login')
            } else {
                setSession(session)
                setUser(session.user.user_metadata.display_name)
                setUserEmail(session.user.email)
            }
        })
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const initials = user
        ? user
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase())
            .join("")
        : "";


    if (!session) return null

    return (
        <div className="dashboardWrapper">
            <nav className="topBar">
                <div className="topBarLeft">
                    <img className="dashboardLogo" src={pizzaIcon} alt="pizzaIcon"/>
                    <div className="leftWrapper">
                        <span className="title">A Slice of Time</span>
                        <span className="currentUser">CREW SCHEDULE PORTAL</span>
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

                    <button
                        className={activeTab === 'schedule' ? 'active' : ''}
                        onClick={() => setActiveTab('schedule')}
                    ><FaCalendarAlt /> Schedule</button>
                    <button
                        className={activeTab === 'employees' ? 'active' : ''}
                        onClick={() => setActiveTab('employees')}
                    ><FaPeopleGroup /> Employees</button>
                    <button
                        className={activeTab === 'history' ? 'active' : ''}
                        onClick={() => setActiveTab('history')}
                    ><MdHistory /> History</button>

                    <div className="bottomSideWrapper">
                        <span className="userAvatar">{initials}</span>
                        <div className="bottomUserWrapper">
                            <span className="currentUser">{user}</span>
                            <span className="managerTag">Manager</span>
                        </div>
                        <button
                            className="settingsButton"
                            onClick={() => {setActiveTab('settings')}}
                        ><IoSettingsOutline/></button>
                    </div>
                </div>

                <div className="mainContent">
                    {activeTab === 'schedule' && <Schedule />}
                    {activeTab === 'employees' && <Employees />}
                    {activeTab === 'history' && <History />}
                    {activeTab === 'settings' && <Settings />}
                </div>

            </div>

        </div>

    )
}