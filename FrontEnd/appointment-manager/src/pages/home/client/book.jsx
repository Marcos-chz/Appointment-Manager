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
    <div className="container min-vh-100 flexC mt-4">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h1 className="text-center mb-4 h1">Book Appointment</h1>

        <form onSubmit={insertAppointment}>
          <label className="form-label">Professional</label>
          <select
            className="form-select mb-3"
            name="professional"
            value={formData.professional}
            onChange={handleChange}
            required
          >
            <option value="">Select a Professional</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>

          <label className="form-label">Date</label>
          <DatePicker
            selected={parseLocalDate(formData.date)}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                date: date.toLocaleDateString("en-CA")
              }))
            }
            minDate={today}
            className="form-control mb-3"
            placeholderText="Select date"
          />

          <label className="form-label">Time</label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {availableTimes.length > 0 ? (
              availableTimes.map((t, i) => (
                <button
                  type="button"
                  key={i}
                  className={`btn ${
                    formData.time === t
                      ? "btn-success"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, time: t }))
                  }
                >
                  {t}
                </button>
              ))
            ) : (
              <span>No availability</span>
            )}
          </div>

          <label className="form-label">Message</label>
          <textarea
            className="form-control mb-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ resize: "none" }}
          />

          {error && <p className="text-danger">{error}</p>}

          <button
            className="btn btn-dark w-100"
            type="submit"
            disabled={!formData.time}
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}