import { Link } from "react-router-dom";

export default function Select() {
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm text-center" style={{ maxWidth: "400px", width: "100%" }}>
        
        <h2 className="mb-2">Create your account</h2>
        <p className="text-muted mb-4">
          Choose how you want to use the platform
        </p>

        <div className="d-grid gap-3">
          <Link
            to="/signUp?role=client"
            className="btn btn-outline-primary btn-lg"
          >
            I'm a Client
          </Link>

          <Link
            to="/signUp?role=professional"
            className="btn btn-outline-success btn-lg"
          >
            I'm a Professional
          </Link>
        </div>

      </div>
    </div>
  );
}
