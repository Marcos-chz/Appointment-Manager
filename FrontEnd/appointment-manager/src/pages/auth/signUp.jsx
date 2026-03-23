import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
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

    const isProfessional = role === "professional"
    const roleColor = isProfessional ? "success" : "primary"
    const roleIcon = isProfessional ? (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ) : (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )

    return (
        <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                        <div className="card border-0 shadow-lg" style={{ borderRadius: "1.5rem" }}>
                            <div className="card-body p-4 p-md-5">
                                
                                {/* Icono/Logo según rol */}
                                <div className="text-center mb-4">
                                    <div className={`bg-${roleColor} bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3`}>
                                        {roleIcon}
                                    </div>
                                    <h1 className="display-6 fw-bold mb-1">Sign Up</h1>
                                    <p className="text-muted">
                                        Create your account as{" "}
                                        <span className={`fw-semibold text-${roleColor}`}>
                                            {role}
                                        </span>
                                    </p>
                                </div>

                                <form onSubmit={insertUsers}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold mb-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                                Name
                                            </label>
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold mb-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                                Last Name
                                            </label>
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold mb-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                            Email
                                        </label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold mb-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                            Password
                                        </label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger py-2 mb-3">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        className={`btn btn-${roleColor} btn-lg w-100 shadow-sm mb-3`}
                                        type="submit"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        Create Account
                                    </button>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            Already have an account?{' '}
                                            <Link to="/signIn" className="text-primary text-decoration-none fw-semibold">
                                                Sign in here
                                            </Link>
                                        </small>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Estilos adicionales */}
            <style>{`
                .card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1) !important;
                }
                .form-control {
                    border-radius: 0.5rem;
                    border: 1px solid #dee2e6;
                    transition: all 0.2s ease;
                }
                .form-control:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
                }
                .btn {
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
                    border: none;
                }
                .btn-primary:hover {
                    background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
                    transform: translateY(-2px);
                }
                .btn-success {
                    background: linear-gradient(135deg, #198754 0%, #157347 100%);
                    border: none;
                }
                .btn-success:hover {
                    background: linear-gradient(135deg, #157347 0%, #146c43 100%);
                    transform: translateY(-2px);
                }
                .bg-opacity-10 {
                    --bs-bg-opacity: 0.1;
                }
                .text-decoration-none:hover {
                    text-decoration: underline !important;
                }
            `}</style>
        </div>
    );
}