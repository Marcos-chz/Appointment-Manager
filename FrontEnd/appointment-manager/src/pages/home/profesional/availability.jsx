import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from '../../../config';

export default function AvailabilityForm() {
  const [day, setDay] = useState("0");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uiDay = Number(day);
    const dayForDB = (uiDay + 1) % 7;

    const newAvailability = {
      userId,
      day: dayForDB,
      startTime,
      endTime,
    };

    try {
      const response = await fetch(
        `${API_URL}/availability/`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(newAvailability),
        }
      );

      const data = await response.json();

      if (response.ok) {
        getAvailability();
        setError(null);
        // Reset form
        setStartTime("00:00");
        setEndTime("00:00");
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (error) {
      setError(error.message || "Network error");
    }
  };

  const getAvailability = async () => {
    try {
      const response = await fetch(
        `${API_URL}/availability/${userId}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setAvailability(data || []);
        setError(null);
      } else {
        setError((data && data.message) || "Unknown error");
      }
    } catch (error) {
      setError(error.message || "Network error");
    }
  };

  useEffect(() => {
    if (userId) getAvailability();
  }, []);

  const slotsByUI = Array.from({ length: 7 }, () => []);

  availability.forEach((a) => {
    const dbIndex = Number(a.day_of_week);
    const uiIndex = (dbIndex + 6) % 7;
    slotsByUI[uiIndex].push({
      start: a.start_time,
      end: a.end_time,
    });
  });

  const uiDayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">Manage Availability</h1>
              <p className="text-muted">Set your working hours for each day of the week</p>
            </div>

            {/* Formulario para agregar disponibilidad */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h5 className="fw-semibold mb-0">Add New Time Slot</h5>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2">Day</label>
                      <select
                        className="form-select form-select-lg"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                      >
                        {uiDayNames.map((d, index) => (
                          <option key={index} value={index}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2">Start Time</label>
                      <input
                        type="time"
                        className="form-control form-control-lg"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2">End Time</label>
                      <input
                        type="time"
                        className="form-control form-control-lg"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Availability
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de slots agregados */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h5 className="fw-semibold mb-0">Your Time Slots</h5>
                </div>

                {availability.length === 0 ? (
                  <div className="text-center py-5">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" className="mb-3">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-muted mb-0">No availability added yet</p>
                    <small className="text-muted">Use the form above to add your working hours</small>
                  </div>
                ) : (
                  <div className="vstack gap-4">
                    {uiDayNames.map((dayName, uiIndex) => {
                      const slots = slotsByUI[uiIndex] || [];
                      if (slots.length === 0) return null;

                      return (
                        <div key={uiIndex}>
                          <h6 className="fw-semibold mb-2 d-flex align-items-center">
                            <span className={`badge rounded-pill me-2 px-3 py-2 ${
                              uiIndex < 5 ? "bg-primary bg-opacity-10 text-primary" : "bg-warning bg-opacity-10 text-warning"
                            }`}>
                              {dayName}
                            </span>
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {slots.map((slot, i) => (
                              <span
                                key={i}
                                className="badge bg-light text-dark border py-2 px-3 rounded-pill"
                                style={{ fontSize: "0.875rem" }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                {slot.start.slice(0, 5)} – {slot.end.slice(0, 5)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger mt-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .card {
          border-radius: 1rem;
        }
        .form-control, .form-select {
          border-radius: 0.5rem;
          border: 1px solid #dee2e6;
          transition: all 0.2s ease;
        }
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
          transform: translateY(-1px);
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        .rounded-pill {
          border-radius: 50rem !important;
        }
        .badge.bg-light {
          background-color: #f8f9fa !important;
          transition: all 0.2s ease;
        }
        .badge.bg-light:hover {
          background-color: #e9ecef !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}