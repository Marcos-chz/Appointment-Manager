import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import {
  getUserIdFromToken,
  getRoleFromToken,
  logout
} from "../../utils/auth";
import API_URL from '../../config';

export default function Profile() {
  const [user, setUser] = useState({});
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    const userRole = getRoleFromToken();

    if (!id || !userRole || !token) {
      logout();
      navigate("/signIn");
      return;
    }

    setUserId(id);
    setRole(userRole);
  }, [navigate, token]);

  const handleLogout = () => {
    logout();
    navigate("/signIn");
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

  const uploadFile = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Only images are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await fetch(
        `${API_URL}/user/avatar?userId=${userId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: formData
        }
      );

      const data = await result.json();

      setUser((prev) => ({
        ...prev,
        avatar: data.avatar
      }));

      setAvatarVersion(Date.now());
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAppointment = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments?id=${userId}`,
        { headers: authHeaders }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/professional?id=${userId}`,
        { headers: authHeaders }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!userId || !role) return;

    getUser();

    if (role === "client") {
      getAppointment();
    } else {
      getProfessionalAppointments();
    }
  }, [userId, role]);

  const historyAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "expired"
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row g-4">

          {/* Tarjeta de perfil */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">

                <div className="position-relative d-inline-block mx-auto mb-3">
                  <img
                    className="rounded-circle"
                    style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #0d6efd" }}
                    src={
                      user.avatar
                        ? `${API_URL}/uploads/avatars/${user.avatar}?v=${avatarVersion}`
                        : `${API_URL}/uploads/avatars/default.png`
                    }
                    alt="avatar"
                    onError={(e) => {
                      e.target.src = `${API_URL}/uploads/avatars/default.png`;
                    }}
                  />
                  <button
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle border-0"
                    style={{ width: "32px", height: "32px", cursor: "pointer" }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </button>
                </div>

                <h5 className="fw-semibold mb-1">
                  {user.name} {user.lastname}
                </h5>
                <p className="text-muted small mb-3">{user.email}</p>

                <input type="file" hidden id="fileInput" onChange={uploadFile} accept="image/*" />

                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={() => setModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Close Session
                </button>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="col-12 col-md-8 col-lg-9">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h5 className="fw-semibold mb-0">Appointment History</h5>
                </div>

                {historyAppointments.length === 0 ? (
                  <div className="text-center py-5">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" className="mb-3">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <p className="text-muted mb-0">No history available</p>
                    <small className="text-muted">Completed appointments will appear here</small>
                  </div>
                ) : (
                  <div className="vstack gap-2">
                    {historyAppointments.map((appointment) => (
                      <div className="card border-0 bg-light" key={appointment.id}>
                        <div className="card-body p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                {role === "client"
                                  ? `Dr. ${appointment.professional_lastname}`
                                  : appointment.user_name}
                              </h6>
                              <small className="text-muted">
                                {new Date(appointment.date).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'long',
                                  year: 'numeric'
                                })} · {appointment.time.slice(0, 5)}
                              </small>
                            </div>
                          </div>
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card border-0 shadow-lg" style={{ maxWidth: "320px", borderRadius: "1rem" }}>
            <div className="card-body text-center p-4">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h5 className="fw-semibold mb-2">Confirm close session?</h5>
              <p className="text-muted small mb-4">You'll need to log in again to access your account</p>
              <div className="d-flex gap-2">
                <button className="btn btn-danger flex-grow-1" onClick={handleLogout}>
                  Yes, logout
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
        .card {
          border-radius: 1rem;
          transition: all 0.2s ease;
        }
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
        }
        .btn-outline-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
      `}</style>
    </div>
  );
}