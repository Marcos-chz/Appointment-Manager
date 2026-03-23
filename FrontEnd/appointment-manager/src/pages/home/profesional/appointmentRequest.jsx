import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../../styles/appointments.css";
import API_URL from '../../../config';

export default function AppointmentRequest() {

  const [appointments, setAppointments] = useState([]);
  const [modal, setModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [statusToChange, setStatusToChange] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (err) {
      console.error("JWT error", err);
    }
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/professional?id=${userId}`,
        {
          method: "GET",
          headers: authHeaders
        }
      );

      if (!response.ok) throw new Error("Error fetching appointments");

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfessionalAppointments();
    }
  }, [userId]);

  const changeStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({ status: statusToChange })
        }
      );

      if (!response.ok) throw new Error("Error updating status");

      setModal(false);
      getProfessionalAppointments();
    } catch (error) {
      console.error(error.message);
    }
  };

  const openModal = (id, status) => {
    setAppointmentId(id);
    setStatusToChange(status);
    setModal(true);
  };

  const visibleAppointments = appointments.filter(
    (app) => app.status !== "completed" && app.status !== "expired"
  );

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "pending": return "bg-warning bg-opacity-10 text-warning";
      case "accepted": return "bg-success bg-opacity-10 text-success";
      case "cancelled": return "bg-danger bg-opacity-10 text-danger";
      default: return "bg-secondary bg-opacity-10 text-secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "accepted":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case "cancelled":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* Header */}
            <div className="mb-4">
              <h1 className="display-6 fw-bold mb-2">Manage Appointments</h1>
              <p className="text-muted mb-0">Review and respond to appointment requests</p>
            </div>

            {/* Lista de turnos */}
            <div className="vstack gap-3">
              {visibleAppointments.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" className="mb-3">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p className="text-muted mb-0">No pending appointments</p>
                    <small className="text-muted">All appointments are processed</small>
                  </div>
                </div>
              ) : (
                visibleAppointments.map((app) => (
                  <div className="card border-0 shadow-sm hover-shadow" key={app.id}>
                    <div className="card-body p-4">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        
                        {/* Info del turno */}
                        <div className="d-flex align-items-center gap-3">
                          <div className={`rounded-circle p-3 ${
                            app.status === "pending" ? "bg-warning bg-opacity-10" :
                            app.status === "accepted" ? "bg-success bg-opacity-10" :
                            "bg-danger bg-opacity-10"
                          }`}>
                            {getStatusIcon(app.status)}
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">
                              {app.user_name}
                            </h6>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <small className="text-muted">
                                {new Date(app.date).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </small>
                              <span className="text-muted">·</span>
                              <small className="text-muted">
                                {app.time.slice(0, 5)} hs
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Status y acciones */}
                        <div className="d-flex align-items-center gap-3">
                          <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(app.status)}`}>
                            {app.status === "pending" ? "Pending" :
                             app.status === "accepted" ? "Accepted" :
                             "Cancelled"}
                          </span>

                          {app.status === "pending" && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => openModal(app.id, "accepted")}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Accept
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => openModal(app.id, "cancelled")}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Cancel
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
      {modal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card border-0 shadow-lg" style={{ maxWidth: "320px", borderRadius: "1rem" }}>
            <div className="card-body text-center p-4">
              <div className={`rounded-circle p-3 d-inline-flex mb-3 ${
                statusToChange === "accepted" 
                  ? "bg-success bg-opacity-10" 
                  : "bg-danger bg-opacity-10"
              }`}>
                {statusToChange === "accepted" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
              </div>
              <h5 className="fw-semibold mb-2">
                Confirm {statusToChange === "accepted" ? "accept" : "cancel"} appointment?
              </h5>
              <p className="text-muted small mb-4">
                {statusToChange === "accepted" 
                  ? "This will confirm the appointment with the client" 
                  : "This action cannot be undone"}
              </p>
              <div className="d-flex gap-2">
                <button 
                  className={`btn flex-grow-1 ${statusToChange === "accepted" ? "btn-success" : "btn-danger"}`} 
                  onClick={changeStatus}
                >
                  Yes, {statusToChange}
                </button>
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => setModal(false)}
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
          transition: all 0.2s ease;
        }
        .btn-success {
          background: linear-gradient(135deg, #198754 0%, #157347 100%);
          border: none;
        }
        .btn-success:hover {
          background: linear-gradient(135deg, #157347 0%, #146c43 100%);
          transform: translateY(-1px);
        }
        .btn-outline-danger:hover {
          transform: translateY(-1px);
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