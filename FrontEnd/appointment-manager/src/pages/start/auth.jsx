import { Route, Routes } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../styles/select.css'

export default function Select() {
  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

            {/* Tarjeta principal */}
            <div className="card border-0 shadow-lg text-center" style={{ borderRadius: "1.5rem" }}>
              <div className="card-body p-4 p-md-5">
                
                {/* Logo/Icono */}
                <div className="mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>

                {/* Título */}
                <h1 className="display-6 fw-bold mb-2">Welcome</h1>
                <p className="text-muted mb-4">
                  Sign in to your account or create a new one to get started
                </p>

                {/* Botones */}
                <div className="d-grid gap-3">
                  <Link to="/signIn" className="btn btn-primary btn-lg shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Sign In
                  </Link>

                  <Link to="/select" className="btn btn-outline-primary btn-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Sign Up
                  </Link>
                </div>

                {/* Línea decorativa */}
                <div className="position-relative my-4">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    or
                  </span>
                </div>

                {/* Mensaje adicional */}
                <div className="mt-3">
                  <small className="text-muted">
                    Join our community and manage your appointments easily
                  </small>
                </div>

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
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
          padding: 0.75rem 1rem;
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
        .btn-outline-primary:hover {
          transform: translateY(-2px);
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        hr {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}