import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (isAuthenticated) {
    if (location.pathname.includes("/login") || location.pathname.includes("/register")) {
      return <Navigate to="/home" />;
    }
  } else {
    if (
      !(
        location.pathname.includes("/login") ||
        location.pathname.includes("/register")
      )
    ) {
      return <Navigate to="/auth/login" />;
    }
  }

  return <>{children}</>;
}

export default CheckAuth;
