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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Update Appointment</h4>

              <form onSubmit={updateAppointment} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Professional</label>
                  <select
                    name="professional"
                    className="form-select"
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

                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    min={today}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Time</label>
                  <select
                    name="time"
                    className="form-select"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="col-12">
                    <div className="alert alert-danger mb-0">{error}</div>
                  </div>
                )}

                <div className="col-12 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm changes
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}