import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../../styles/appointments.css";
import API_URL from '../../../config';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const getAppointment = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments?id=${userId}`,
        {
          method: "GET",
          headers: authHeaders
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Error fetching appointments:", response.statusText);
      }
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  useEffect(() => {
    if (token && userId) {
      getAppointment();
    }
  }, [userId]);

  const deleteAppointment = async (a_id) => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/${a_id}`,
        {
          method: "DELETE",
          headers: authHeaders
        }
      );

      if (response.ok) {
        await getAppointment();
        setModalDelete(false);
      } else {
        console.error("Error deleting appointment:", response.statusText);
      }
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  const confirmDelete = (a_id) => {
    setIdToDelete(a_id);
    setModalDelete(true);
  };

  const activeAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "accepted"
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h1 className="display-6 fw-bold mb-1">My Appointments</h1>
                <p className="text-muted mb-0">Manage your upcoming appointments</p>
              </div>
              <Link to="/home/book" className="btn btn-primary shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Appointment
              </Link>
            </div>

            {/* Lista de turnos */}
            <div className="vstack gap-3">
              {activeAppointments.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" className="mb-3">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p className="text-muted mb-0">No active appointments</p>
                    <small className="text-muted">Book your first appointment now</small>
                  </div>
                </div>
              ) : (
                activeAppointments.map((appointment) => (
                  <div className="card border-0 shadow-sm hover-shadow" key={appointment.id}>
                    <div className="card-body p-4">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        
                        {/* Info del turno */}
                        <div className="d-flex align-items-center gap-3">
                          <div className={`rounded-circle p-3 ${
                            appointment.status === "accepted" 
                              ? "bg-success bg-opacity-10" 
                              : "bg-warning bg-opacity-10"
                          }`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                              stroke={appointment.status === "accepted" ? "#198754" : "#ffc107"} 
                              strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">
                              Dr. {appointment.professional_lastname}
                            </h6>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <small className="text-muted">
                                {new Date(appointment.date).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </small>
                              <span className="text-muted">·</span>
                              <small className="text-muted">
                                {appointment.time.slice(0, 5)} hs
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Status y acciones */}
                        <div className="d-flex align-items-center gap-3">
                          <span className={`badge rounded-pill px-3 py-2 ${
                            appointment.status === "accepted"
                              ? "bg-success bg-opacity-10 text-success"
                              : "bg-warning bg-opacity-10 text-warning"
                          }`}>
                            {appointment.status === "accepted" ? "Confirmed" : "Pending"}
                          </span>

                          {appointment.status === "pending" && (
                            <div className="d-flex gap-2">
                              <Link
                                to={`/update-appointment/${appointment.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                                </svg>
                                Edit
                              </Link>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => confirmDelete(appointment.id)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalDelete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card border-0 shadow-lg" style={{ maxWidth: "320px", borderRadius: "1rem" }}>
            <div className="card-body text-center p-4">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <h5 className="fw-semibold mb-2">Delete appointment?</h5>
              <p className="text-muted small mb-4">This action cannot be undone</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-danger flex-grow-1"
                  onClick={() => deleteAppointment(idToDelete)}
                >
                  Yes, delete
                </button>
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => setModalDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos adicionales */}
      <style>{`
        .hover-shadow {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
        }
        .card {
          border-radius: 1rem;
        }
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        .rounded-pill {
          border-radius: 50rem !important;
        }
      `}</style>
    </div>
  );
}