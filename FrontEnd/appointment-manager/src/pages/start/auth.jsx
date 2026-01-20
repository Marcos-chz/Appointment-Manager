import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../styles/select.css'

export default function Select(){


    return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div
        className="card p-4 shadow-sm text-center"
        style={{ maxWidth: "400px", width: "100%" }}
        >
        <h2 className="mb-2">Welcome</h2>
        <p className="text-muted mb-4">
            Sign in or create a new account
        </p>

        <div className="d-grid gap-3">
            <Link to="/signIn" className="btn btn-primary btn-lg">
            Sign In
            </Link>

            <Link to="/select" className="btn btn-outline-dark btn-lg">
            Sign Up
            </Link>
        </div>
        </div>
    </div>
    );

}
