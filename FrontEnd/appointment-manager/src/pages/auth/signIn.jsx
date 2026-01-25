import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export default function SignIn() {
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const insertUsers = (e) => {
        e.preventDefault()

        const user = { email, password }

        fetch(`${API_URL}/auth/signIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error || 'Error to signIn')
                })
            }
            return res.json()
        })
        .then(data => {
            setEmail('')
            setPassword('')
            localStorage.setItem('token', data.token)
            navigate('/home')
        })
        .catch(error => {
            setError(error.message)
        })
    }

    const loginDemo = (role) => {
        setError('')

        if (role === 'client') {
            setEmail('client@demo.com')
            setPassword('123456')
        }

        if (role === 'professional') {
            setEmail('professional@demo.com')
            setPassword('123456')
        }
    }

    return (
        <div className="container min-vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-100 justify-content-center">

                <div className="col-md-6 mb-3 mb-md-0">
                    <div className="card p-4 shadow-sm">
                        <div className="text-center mb-3">
                            <h2 className="mb-1">Sign In</h2>
                            <p className="text-muted">
                                Welcome back 👋
                            </p>
                        </div>

                        <form onSubmit={insertUsers}>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control mb-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {error && (
                                <div className="alert alert-danger py-2">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100">
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-4 shadow-sm h-100">
                        <h6 className="mb-2">Demo access</h6>
                        <p className="text-muted small">
                            Use pre-created demo accounts
                        </p>

                        <button
                            type="button"
                            className="btn btn-outline-primary w-100 mb-2"
                            onClick={() => loginDemo('client')}
                        >
                            Login as Client
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-success w-100"
                            onClick={() => loginDemo('professional')}
                        >
                            Login as Professional
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}