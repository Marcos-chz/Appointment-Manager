import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from '../../../config';

export default function UpdateAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    professional: "",
    date: "",
    time: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
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
    const fetchAppointment = async () => {
      try {
        const res = await fetch(
          `${API_URL}/appointments/${id}`,
          {
            method: "GET",
            headers: authHeaders
          }
        );

        if (!res.ok) throw new Error("Error fetching appointment");

        const data = await res.json();

        setFormData({
          professional: data.professional,
          date: data.date.slice(0, 10),
          time: data.time.slice(0, 5)
        });

        setMessage(data.message || "");
      } catch (err) {
        console.error(err);
        setError("Could not load appointment data");
      }
    };

    fetchAppointment();
  }, [id]);

  const updateAppointment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/appointments/${id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            professional: formData.professional,
            date: formData.date,
            time: formData.time,
            message
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating appointment");
      }

      navigate("/home/appointments");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">Update Appointment</h1>
              <p className="text-muted">Modify your appointment details</p>
            </div>

            {/* Formulario */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={updateAppointment}>
                  
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
                      name="professional"
                      className="form-select form-select-lg"
                      value={formData.professional}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a professional</option>
                      <option value="1">Dra. García</option>
                      <option value="2">Dr. Fernández</option>
                      <option value="3">Lic. López</option>
                    </select>
                  </div>

                  <div className="row g-3 mb-4">
                    {/* Date */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control form-control-lg"
                        value={formData.date}
                        min={today}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Time
                      </label>
                      <select
                        name="time"
                        className="form-select form-select-lg"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select time</option>
                        <option value="09:00">09:00 hs</option>
                        <option value="10:00">10:00 hs</option>
                        <option value="11:00">11:00 hs</option>
                      </select>
                    </div>
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
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any additional information..."
                      style={{ resize: "none" }}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-4">
                      <small>{error}</small>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-4 shadow-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                      Confirm changes
                    </button>
                  </div>

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