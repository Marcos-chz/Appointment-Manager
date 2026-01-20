import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../../styles/appointments.css";

export default function AppointmentRequest() {

  const [appointments, setAppointments] = useState([]);
  const [modal, setModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [statusToChange, setStatusToChange] = useState("");

  // =========================
  // AUTH
  // =========================
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

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/appointments/professional?id=${userId}`,
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

  // =========================
  // CHANGE STATUS
  // =========================
  const changeStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/appointments/${appointmentId}/status`,
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

  // =========================
  // MODAL
  // =========================
  const openModal = (id, status) => {
    setAppointmentId(id);
    setStatusToChange(status);
    setModal(true);
  };

  // =========================
  // FILTER
  // =========================
  const visibleAppointments = appointments.filter(
    (app) => app.status !== "completed" && app.status !== "expired"
  );

  // =========================
  // RENDER
  // =========================
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">

          <h1 className="mb-4">My Appointments</h1>

          {visibleAppointments.length === 0 && (
            <div className="alert alert-secondary text-center">
              No pending appointments
            </div>
          )}

          {visibleAppointments.map((app) => (
            <div className="card shadow-sm mb-3" key={app.id}>
              <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                {/* INFO */}
                <div>
                  <h6 className="mb-1">{app.user_name}</h6>
                  <small className="text-muted">
                    {new Date(app.date).toLocaleDateString()} ·{" "}
                    {app.time.slice(0, 5)}
                  </small>
                </div>

                {/* STATUS */}
                <span
                  className={`badge ${
                    app.status === "pending"
                      ? "bg-warning"
                      : app.status === "accepted"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {app.status}
                </span>

                {/* ACTIONS */}
                {app.status === "pending" && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => openModal(app.id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal(app.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="card p-4 text-center" style={{ maxWidth: "320px" }}>
            <h5 className="mb-3">
              Confirm {statusToChange} appointment?
            </h5>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-primary" onClick={changeStatus}>
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
