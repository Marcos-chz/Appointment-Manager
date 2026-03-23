import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from '../../../config';

export default function Clients() {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("JWT error", err);
      }
    }
  }, [token]);

  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/professional?id=${userId}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching appointments");
      }

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

  const clients = Array.from(
    new Map(
      appointments.map((a) => [
        a.user_id,
        {
          id: a.user_id,
          name: a.user_name,
          email: a.email,
          avatar: a.avatar,
        },
      ])
    ).values()
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">

            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">My Clients</h1>
              <p className="text-muted">Manage your client relationships</p>
            </div>

            {/* Lista de clientes */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {clients.length === 0 ? (
                  <div className="text-center py-5">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" className="mb-3">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p className="text-muted mb-0">No clients yet</p>
                    <small className="text-muted">Clients will appear here after appointments</small>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 py-3 ps-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Client
                          </th>
                          <th className="border-0 py-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client, index) => (
                          <tr key={client.id} className="hover-row">
                            <td className="py-3 ps-4">
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={
                                    client.avatar
                                      ? `${API_URL}/uploads/avatars/${client.avatar}`
                                      : `${API_URL}/uploads/avatars/default.png`
                                  }
                                  alt={client.name}
                                  width="42"
                                  height="42"
                                  className="rounded-circle object-fit-cover border"
                                  style={{ objectFit: "cover" }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${API_URL}/uploads/avatars/default.png`;
                                  }}
                                />
                                <div>
                                  <span className="fw-semibold d-block">
                                    {client.name}
                                  </span>
                                  <small className="text-muted">
                                    Client #{index + 1}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <span className="text-muted">
                                  {client.email}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Estadística rápida */}
            {clients.length > 0 && (
              <div className="mt-4 text-center">
                <div className="d-inline-flex align-items-center gap-2 px-4 py-2 bg-white rounded-pill shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="fw-semibold">Total clients:</span>
                  <span className="text-primary fw-bold">{clients.length}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .card {
          border-radius: 1rem;
          overflow: hidden;
        }
        .table {
          margin-bottom: 0;
        }
        .table > :not(caption) > * > * {
          border-bottom-width: 1px;
          border-color: #e9ecef;
        }
        .table-hover tbody tr {
          transition: background-color 0.2s ease;
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
        .hover-row {
          transition: all 0.2s ease;
        }
        .rounded-circle {
          border-radius: 50% !important;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .bg-light {
          background-color: #f8f9fa !important;
        }
        .rounded-pill {
          border-radius: 50rem !important;
        }
      `}</style>
    </div>
  );
}