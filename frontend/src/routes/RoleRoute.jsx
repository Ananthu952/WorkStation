import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage: <Route element={<RoleRoute allowedRoles={["provider"]} />}>...</Route>
// Must be nested inside a <ProtectedRoute /> so `user` is already guaranteed to exist.
// A user can hold multiple roles (e.g. ["client", "provider"]), so this checks
// whether ANY of their roles is in the allowed list.
export default function RoleRoute({ allowedRoles }) {
  const { roles } = useAuth();

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
