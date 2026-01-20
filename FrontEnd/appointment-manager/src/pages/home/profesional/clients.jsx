import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Clients() {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);

  // =========================
  // AUTH
  // =========================
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

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/appointments/professional?id=${userId}`,
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

  // =========================
  // UNIQUE CLIENTS
  // =========================
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

  // =========================
  // RENDER
  // =========================
  return (
    <div className="container-sm mt-4">
      <h3 className="mb-4 text-center">My Clients</h3>

      {clients.length === 0 ? (
        <div className="alert alert-secondary text-center">
          No clients yet.
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th className="text-start">Client</th>
                  <th className="text-start">Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            client.avatar
                              ? `http://localhost:4000/uploads/avatars/${client.avatar}`
                              : "http://localhost:4000/uploads/avatars/default.png"
                          }
                          alt="client avatar"
                          width="38"
                          height="38"
                          className="rounded-circle"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://localhost:4000/uploads/avatars/default.png";
                          }}
                        />
                        <span className="fw-medium">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">
                      {client.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
