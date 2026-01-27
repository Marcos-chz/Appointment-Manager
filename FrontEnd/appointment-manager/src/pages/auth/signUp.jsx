import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import API_URL from '../../config';

export default function SignUp(){
    const [ error, setError] = useState('')
    const [params] = useSearchParams();
    const role = params.get("role");
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const insertUsers = (e) =>{
        e.preventDefault()

        const newUser = {
            name,
            lastname,
            email,
            password,
            role
        } 

        fetch(`${API_URL}/auth/signUp`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(newUser)
        })
        .then( res => {
            if(!res.ok){
                return res.json().then(err => {
                    throw new Error(err.error || 'Error to create user')
                })
            }
            return res.json()
        })
        .then(data => {
            setName('')
            setLastname('')
            setEmail('')
            setPassword('')
            navigate('/signIn')
        })
        .catch(error =>{
            setError(error.message)
        })
    }

    return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "420px", width: "100%" }}
        >
        <div className="text-center mb-3">
            <h2 className="mb-1">Sign Up</h2>
            <p className="text-muted mb-2">
            Create your account as{" "}
            <span
                className={`fw-semibold ${
                role === "professional" ? "text-success" : "text-primary"
                }`}
            >
                {role}
            </span>
            </p>
        </div>

        <form onSubmit={insertUsers}>
            <label className="form-label">Name</label>
            <input
            className="form-control mb-3"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />

            <label className="form-label">Last Name</label>
            <input
            className="form-control mb-3"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            />

            <label className="form-label">E-mail</label>
            <input
            className="form-control mb-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <label className="form-label">Password</label>
            <input
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
            className={`btn w-100 ${
                role === "professional" ? "btn-success" : "btn-primary"
            }`}
            type="submit"
            >
            Create Account
            </button>
        </form>
        </div>
    </div>
    );
}