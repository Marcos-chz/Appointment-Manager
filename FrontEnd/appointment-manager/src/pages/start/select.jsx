import { Link } from "react-router-dom";

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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                {/* Título */}
                <h1 className="display-6 fw-bold mb-2">Create your account</h1>
                <p className="text-muted mb-4">
                  Choose how you want to use the platform
                </p>

                {/* Botones */}
                <div className="d-grid gap-3">
                  <Link
                    to="/signUp?role=client"
                    className="btn btn-outline-primary btn-lg py-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    I'm a Client
                  </Link>

                  <Link
                    to="/signUp?role=professional"
                    className="btn btn-outline-success btn-lg py-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    I'm a Professional
                  </Link>
                </div>

                {/* Línea decorativa */}
                <div className="position-relative my-4">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    already have an account?
                  </span>
                </div>

                {/* Enlace a Sign In */}
                <div className="mt-2">
                  <Link to="/signIn" className="text-decoration-none">
                    <small className="text-primary fw-semibold">
                      Sign in here →
                    </small>
                  </Link>
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
          transition: all 0.2s ease;
        }
        .btn-outline-primary:hover, .btn-outline-success:hover {
          transform: translateY(-2px);
        }
        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border-color: #0d6efd;
          color: white;
        }
        .btn-outline-success:hover {
          background: linear-gradient(135deg, #198754 0%, #157347 100%);
          border-color: #198754;
          color: white;
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        hr {
          opacity: 0.3;
        }
        .text-decoration-none:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}