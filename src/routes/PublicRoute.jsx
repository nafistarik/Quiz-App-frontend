import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Expect the component as a prop
const PublicRoute = ({ component: Component, restricted = false }) => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated and trying to access restricted routes
  if (restricted && isAuthenticated) {
    // Redirect to the dashboard (or another protected route)
    return <Navigate to="/" />;
  }

  // If not restricted, allow access to the public component
  return <Component />;
};

export default PublicRoute;
