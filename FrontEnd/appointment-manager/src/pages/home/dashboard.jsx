import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from '../../config';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userId = null;
  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
    role = decoded.role;
  } else {
    navigate("/signIn");
  }

  const isClient = role === "client";
  const isProfessional = role === "professional";

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  const getUser = async () => {
    try {
      const result = await fetch(
        `${API_URL}/user?userId=${userId}`,
        { headers: authHeaders }
      );

      if (result.ok) {
        const data = await result.json();
        setUser(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAppointments = async () => {
    try {
      const url = isProfessional
        ? `${API_URL}/appointments/professional?id=${userId}`
        : `${API_URL}/appointments?id=${userId}`;

      const response = await fetch(url, { headers: authHeaders });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    getUser();
    getAppointments();
  }, []);

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );

  const acceptedAppointments = appointments.filter(
    (a) => a.status === "accepted"
  );

  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingAppointment = acceptedAppointments
    .filter((a) => a.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const todayAppointments = acceptedAppointments.filter(
    (a) => a.date === todayStr
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header con gradiente */}
        <div className="card border-0 shadow-sm mb-4 bg-primary text-white">
          <div className="card-body p-4">
            <h1 className="display-5 fw-bold mb-2">Dashboard</h1>
            <p className="opacity-75 mb-0 fs-5">
              Welcome{user.name && `, ${user.name}`}
              {isProfessional && " 👨‍⚕️ (Professional)"}
              {isClient && " 👤 (Client)"}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {isClient && (
            <>
              {/* Tarjeta de próximo turno */}
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-info">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <h5 className="card-title fw-semibold mb-0">Next appointment</h5>
                    </div>
                    {upcomingAppointment ? (
                      <>
                        <p className="fs-2 fw-bold text-info mb-2">
                          {new Date(upcomingAppointment.date).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-muted mb-0">
                          with Dr. {upcomingAppointment.professional_lastname}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted mb-0">No upcoming accepted appointments</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tarjeta de turnos pendientes */}
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <h5 className="card-title fw-semibold mb-0">Pending appointments</h5>
                    </div>
                    <p className="display-4 fw-bold text-warning mb-0">{pendingAppointments.length}</p>
                    <p className="text-muted small mb-0">waiting for confirmation</p>
                  </div>
                </div>
              </div>

              {/* CTA para reservar turno */}
              <div className="col-12">
                <div className="card border-0 shadow-sm bg-gradient-success">
                  <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                      <h5 className="mb-1 fw-semibold">Need a new appointment?</h5>
                      <p className="mb-0 text-muted">Schedule your next visit in minutes</p>
                    </div>
                    <Link to="/home/book" className="btn btn-primary btn-lg px-4 shadow-sm">
                      Book appointment →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {isProfessional && (
            <>
              {/* Estadísticas profesionales */}
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <h5 className="card-title fw-semibold mb-0">Today</h5>
                    </div>
                    <p className="display-4 fw-bold text-success mb-0">{todayAppointments.length}</p>
                    <p className="text-muted small mb-0">appointments scheduled</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                          <path d="M22 6.5L12 13 2 6.5M22 6.5v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-10L12 13l10-6.5z"></path>
                        </svg>
                      </div>
                      <h5 className="card-title fw-semibold mb-0">Pending</h5>
                    </div>
                    <p className="display-4 fw-bold text-warning mb-0">{pendingAppointments.length}</p>
                    <p className="text-muted small mb-0">requests to review</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                      </div>
                      <h5 className="card-title fw-semibold mb-0">Upcoming</h5>
                    </div>
                    <p className="display-4 fw-bold text-primary mb-0">{acceptedAppointments.length}</p>
                    <p className="text-muted small mb-0">confirmed appointments</p>
                  </div>
                </div>
              </div>

              {/* Acciones profesionales */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4 d-flex flex-wrap justify-content-center gap-3">
                    <Link to="/home/availability" className="btn btn-outline-secondary btn-lg px-4">
                      📅 Manage your agenda
                    </Link>
                    <Link to="/home/p_appointments" className="btn btn-primary btn-lg px-4 shadow-sm">
                      ✨ Manage appointments
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actividad reciente */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Recent activity</h5>
                <div className="text-center py-4">
                  <div className="text-muted">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                      <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2M7 10l5 5 5-5M12 15V3"></path>
                    </svg>
                    <p className="mb-0">Coming soon</p>
                    <small className="text-muted">Activity feed will appear here</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .hover-shadow {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .card {
          border-radius: 1rem;
          transition: all 0.2s ease;
        }
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
        }
        .btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
          transform: translateY(-1px);
        }
        .btn-outline-secondary:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}