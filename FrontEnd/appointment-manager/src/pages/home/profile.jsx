import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import {
  getUserIdFromToken,
  getRoleFromToken,
  logout
} from "../../utils/auth";

export default function Profile() {
  const [user, setUser] = useState({});
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    const userRole = getRoleFromToken();

    if (!id || !userRole || !token) {
      logout();
      navigate("/signIn");
      return;
    }

    setUserId(id);
    setRole(userRole);
  }, [navigate, token]);

  const handleLogout = () => {
    logout();
    navigate("/signIn");
  };

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

  const uploadFile = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Only images are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await fetch(
        `http://localhost:4000/user/avatar?userId=${userId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: formData
        }
      );

      const data = await result.json();

      setUser((prev) => ({
        ...prev,
        avatar: data.avatar
      }));

      setAvatarVersion(Date.now());
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAppointment = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/appointments?id=${userId}`,
        { headers: authHeaders }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getProfessionalAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/appointments/professional?id=${userId}`,
        { headers: authHeaders }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!userId || !role) return;

    getUser();

    if (role === "client") {
      getAppointment();
    } else {
      getProfessionalAppointments();
    }
  }, [userId, role]);

  return (
    <div className="min-vh-100 d-flex align-items-center p-4">
      <div className="container-fluid">
        <div className="row g-3">

          <div className="col-12 col-md-4 col-lg-3">
            <div className="card text-center p-3 h-100">

              <img
                className="rounded-circle mx-auto mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                src={
                  user.avatar
                    ? `http://localhost:4000/uploads/avatars/${user.avatar}?v=${avatarVersion}`
                    : "http://localhost:4000/uploads/avatars/default.png"
                }
                alt="avatar"
                onError={(e) => {
                  e.target.src =
                    "http://localhost:4000/uploads/avatars/default.png";
                }}
              />

              <h5 className="mb-1">
                {user.name} {user.lastname}
              </h5>
              <p className="text-muted mb-3">{user.email}</p>

              <input type="file" hidden id="fileInput" onChange={uploadFile} />

              <button
                className="btn btn-outline-secondary btn-sm mb-2"
                onClick={() =>
                  document.getElementById("fileInput").click()
                }
              >
                Edit photo
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => setModal(true)}
              >
                Close Session
              </button>
            </div>
          </div>

          <div className="col-12 col-md-8 col-lg-9">
            <div className="card p-3 h-100">
              <h5 className="mb-3">History</h5>

              {appointments.filter(
                (a) => a.status === "completed" || a.status === "expired"
              ).length === 0 && (
                <div className="alert alert-secondary text-center">
                  No history available
                </div>
              )}

              {appointments
                .filter(
                  (a) =>
                    a.status === "completed" || a.status === "expired"
                )
                .map((appointment) => (
                  <div className="card shadow-sm mb-2" key={appointment.id}>
                    <div className="card-body d-flex justify-content-between align-items-center">

                      <div>
                        <h6 className="mb-1">
                          {role === "client"
                            ? `Dr. ${appointment.professional_lastname}`
                            : appointment.user_name}
                        </h6>
                        <small className="text-muted">
                          {new Date(appointment.date).toLocaleDateString()} ·{" "}
                          {appointment.time.slice(0, 5)}
                        </small>
                      </div>

                      <span className="badge bg-success">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {modal && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
              <div className="card p-4 text-center" style={{ maxWidth: "320px" }}>
                <h5 className="mb-3">Confirm close session?</h5>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-danger" onClick={handleLogout}>
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
      </div>
    </div>
  );
}
