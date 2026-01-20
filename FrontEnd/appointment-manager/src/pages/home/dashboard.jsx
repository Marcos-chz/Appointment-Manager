import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userId = null;
  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
    role = decoded.role;
  } else {
    navigate("/signIn");
  }

  const isClient = role === "client";
  const isProfessional = role === "professional";

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  // FETCH USER
  const getUser = async () => {
    try {
      const result = await fetch(
        `http://localhost:4000/user?userId=${userId}`,
        { headers: authHeaders }
      );

      if (result.ok) {
        const data = await result.json();
        setUser(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // FETCH APPOINTMENTS
  const getAppointments = async () => {
    try {
      const url = isProfessional
        ? `http://localhost:4000/appointments/professional?id=${userId}`
        : `http://localhost:4000/appointments?id=${userId}`;

      const response = await fetch(url, { headers: authHeaders });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    getUser();
    getAppointments();
  }, []);

  // DATA
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );

  const acceptedAppointments = appointments.filter(
    (a) => a.status === "accepted"
  );

  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingAppointment = acceptedAppointments
    .filter((a) => a.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const todayAppointments = acceptedAppointments.filter(
    (a) => a.date === todayStr
  );

  return (
    <div className="container min-vh-100 py-4">
      <div className="row g-4">

        <div className="col-12">
          <div className="card p-4">
            <h1 className="mb-1">Dashboard</h1>
            <h5 className="text-muted mb-0">
              Welcome{user.name && `, ${user.name}`}
              {isProfessional && " (Professional)"}
            </h5>
          </div>
        </div>

        {isClient && (
          <>
            <div className="col-12 col-md-6">
              <div className="card p-3 h-100">
                <h5 className="mb-2">Next appointment</h5>
                <p className="mb-0">
                  {upcomingAppointment ? (
                    <>
                      {new Date(
                        upcomingAppointment.date
                      ).toLocaleDateString()}{" "}
                      with Dr. {upcomingAppointment.professional_lastname}
                    </>
                  ) : (
                    "No upcoming accepted appointments"
                  )}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card p-3 h-100">
                <h5 className="mb-2">Pending appointments</h5>
                <p className="fs-4 mb-0">{pendingAppointments.length}</p>
              </div>
            </div>

            <div className="col-12">
              <div className="card p-3 d-flex flex-row justify-content-between align-items-center">
                <p className="mb-0">Need a new appointment?</p>
                <Link to="/home/book" className="btn btn-primary">
                  Book appointment
                </Link>
              </div>
            </div>
          </>
        )}

        {isProfessional && (
          <>
            <div className="col-12 col-md-4">
              <div className="card p-3 h-100">
                <h5 className="mb-2">Appointments today</h5>
                <p className="fs-4 mb-0">{todayAppointments.length}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card p-3 h-100">
                <h5 className="mb-2">Pending requests</h5>
                <p className="fs-4 mb-0">{pendingAppointments.length}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card p-3 h-100">
                <h5 className="mb-2">Upcoming appointments</h5>
                <p className="fs-4 mb-0">{acceptedAppointments.length}</p>
              </div>
            </div>

            <div className="col-12">
              <div className="card p-3 d-flex flex-row justify-content-between align-items-center">
                <Link to="/home/availability" className="btn btn-secondary">
                  Manage your agenda
                </Link>
                <Link to="/home/p_appointments" className="btn btn-primary">
                  Manage appointments
                </Link>
              </div>
            </div>
          </>
        )}

        <div className="col-12">
          <div className="card p-3">
            <h5 className="mb-2">Recent activity</h5>
            <p className="text-muted mb-0">Coming soon</p>
          </div>
        </div>

      </div>
    </div>
  );
}
