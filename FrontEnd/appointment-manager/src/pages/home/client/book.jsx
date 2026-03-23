import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from '../../../config';

export default function Book() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    professional: "",
    date: "",
    time: ""
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [professionals, setProfessionals] = useState([]);

  const today = new Date();
  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.professional || !formData.date) {
        setAvailableTimes([]);
        setFormData((prev) => ({ ...prev, time: "" }));
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/availability/${formData.professional}/${formData.date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setAvailableTimes(data);

        if (!data.includes(formData.time)) {
          setFormData((prev) => ({ ...prev, time: "" }));
        }
      } catch (err) {
        console.error(err);
        setAvailableTimes([]);
      }
    };

    if (token) {
      fetchAvailability();
    }
  }, [formData.professional, formData.date]);

  const insertAppointment = async (e) => {
    e.preventDefault();

    let userId = null;

    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    }

    const dataToSend = {
      ...formData,
      message,
      userId
    };

    try {
      const result = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(dataToSend)
      });

      if (result.ok) {
        navigate("/home/appointments");
      } else {
        const errorData = await result.json();
        throw new Error(errorData.error || "Error creating appointment");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getProfessionals = async () => {
    try {
      const result = await fetch(
        `${API_URL}/user/professional`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (result.ok) {
        const data = await result.json();
        setProfessionals(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      getProfessionals();
    }
  }, []);

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day);
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">Book an Appointment</h1>
              <p className="text-muted">Schedule your next visit with a professional</p>
            </div>

            {/* Formulario */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={insertAppointment}>
                  
                  {/* Professional */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Professional
                    </label>
                    <select
                      className="form-select form-select-lg"
                      name="professional"
                      value={formData.professional}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a professional</option>
                      {professionals.map((professional) => (
                        <option key={professional.id} value={professional.id}>
                          {professional.name} {professional.lastname}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Date
                    </label>
                    <DatePicker
                      selected={parseLocalDate(formData.date)}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: date.toLocaleDateString("en-CA")
                        }))
                      }
                      minDate={today}
                      className="form-control form-control-lg"
                      placeholderText="Select a date"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>

                  {/* Time */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Time
                    </label>
                    {formData.professional && formData.date ? (
                      availableTimes.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {availableTimes.map((t, i) => (
                            <button
                              type="button"
                              key={i}
                              className={`btn ${
                                formData.time === t
                                  ? "btn-primary"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, time: t }))
                              }
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-light text-center py-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" className="mb-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          <p className="mb-0 text-muted">No available times for this date</p>
                        </div>
                      )
                    ) : (
                      <div className="alert alert-light text-center py-3">
                        <p className="mb-0 text-muted">Select a professional and date first</p>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Message (optional)
                    </label>
                    <textarea
                      className="form-control"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Any additional information or special requests..."
                      style={{ resize: "none" }}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-3">
                      <small>{error}</small>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-lg w-100 shadow-sm"
                    type="submit"
                    disabled={!formData.time || !formData.professional || !formData.date}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Confirm Appointment
                  </button>
                </form>
              </div>
            </div>

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
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
          transform: translateY(-1px);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-outline-secondary {
          transition: all 0.2s ease;
        }
        .btn-outline-secondary:hover {
          transform: translateY(-1px);
        }
        .react-datepicker-wrapper {
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  );
}