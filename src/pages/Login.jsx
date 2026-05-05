/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { data, useNavigate } from 'react-router-dom'
import pizzaIcon from "../assets/pizzaIcon.png"
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { FaLongArrowAltRight } from "react-icons/fa";
import "./Login.css"
import { supabase } from '../supabaseClient'


export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError('Invalid email or password')
            setLoading(false)
        } else {
            navigate('/dashboard')
        }

    }

    //Renable after testing.
    /*useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/dashboard')
            }
        })
    }, [])*/

    return (
        <div className="loginWrapper">
            <main className="loginCard">
                <div className="topHalf">
                    <header>
                        <img src={pizzaIcon} className="logo" alt="pizzaIcon" />
                        <h1>A Slice of Time</h1>
                        <span>CREW SCHEDULE PORTAL</span>
                    </header>
                </div>
                <div className="bottomHalf">
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email address: </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            required
                            autoComplete="email"
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password: </label>
                        <div className="passwordWrapper">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            required
                            placeholder="Enter password"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                        </div>

                        <span>{error}</span>
                        <button type="submit">
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="managerMessage">
                                    <span>AUTHORIZED MANAGERS ONLY</span>
                                        </div>

            </main>
        </div>
    )
}