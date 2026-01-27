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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Appointments</h1>
            <Link to="/home/book" className="btn btn-primary">
              New Appointment
            </Link>
          </div>

          <div className="row g-3">
            {activeAppointments.length === 0 && (
              <div className="col-12">
                <div className="alert alert-secondary text-center">
                  No active appointments
                </div>
              </div>
            )}

            {activeAppointments.map((appointment) => (
              <div className="col-12" key={appointment.id}>
                <div className="card shadow-sm">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div>
                      <h6 className="mb-1">
                        Dr. {appointment.professional_lastname}
                      </h6>
                      <small className="text-muted">
                        {new Date(appointment.date).toLocaleDateString()} ·{" "}
                        {appointment.time.slice(0, 5)}
                      </small>
                    </div>

                    <span
                      className={`badge ${
                        appointment.status === "accepted"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {appointment.status}
                    </span>

                    {appointment.status === "pending" && (
                      <div className="d-flex gap-2">
                        <Link
                          to={`/update-appointment/${appointment.id}`}
                          className="btn btn-outline-warning btn-sm"
                        >
                          Update
                        </Link>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => confirmDelete(appointment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {modalDelete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="card p-4 text-center" style={{ maxWidth: "320px" }}>
            <h5 className="mb-3">Confirm delete?</h5>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-danger"
                onClick={() => deleteAppointment(idToDelete)}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setModalDelete(false)}
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