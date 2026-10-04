/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { UrlState } from "@/context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const { loading, isAuthenticated } = UrlState();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          background: "var(--bg)",
        }}
      >
        <BarLoader width={220} color="var(--primary)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default RequireAuth;
