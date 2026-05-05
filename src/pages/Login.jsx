import {useEffect, useState} from 'react'
import {data, useNavigate} from 'react-router-dom'
import pizzaIcon from "../assets/pizzaIcon.png"
import "./Login.css"
import {supabase} from '../supabaseClient'

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
        <body>
            <header>
                <img src={pizzaIcon} className="logo" alt="pizzaIcon" />
                <h1>A Slice of Time</h1>
            </header>

            <main className="login">
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
                    <input
                    id="password"
                    type="password"
                    value={password}
                    required
                    placeholder="Enter password"
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <span>{error}</span>
                    <button type="submit">Login</button>
                </form>
            </main>
        </body>
    )
}