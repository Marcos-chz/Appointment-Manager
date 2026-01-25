import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Professional Availability
              </h5>

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Day</label>
                  <select
                    className="form-select"
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
                  <label className="form-label">Start time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">End time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Add availability
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Added slots</h5>

              {uiDayNames.map((dayName, uiIndex) => {
                const slots = slotsByUI[uiIndex] || [];
                if (slots.length === 0) return null;

                return (
                  <div key={uiIndex} className="mb-3">
                    <h6 className="mb-2">{dayName}</h6>

                    <div className="d-flex flex-wrap gap-2">
                      {slots.map((slot, i) => (
                        <span
                          key={i}
                          className="badge bg-secondary py-2 px-3"
                        >
                          {slot.start.slice(0, 5)} –{" "}
                          {slot.end.slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {availability.length === 0 && (
                <div className="alert alert-secondary text-center mb-0">
                  No availability added yet
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}