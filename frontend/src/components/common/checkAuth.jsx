import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    //   console.log(location.pathname, isAuthenticated);

    if (location.pathname === "/") {
        if (!isAuthenticated) {
            return <Navigate to="/auth/login" />;
        } else {
            return <Navigate to="/" />
        }
    }

    if (
        !isAuthenticated &&
        !(
            location.pathname.includes("/login") ||
            location.pathname.includes("/register")
        )
    ) {
        return <Navigate to="/auth/login" />;
    }

    if (
        isAuthenticated &&
        (location.pathname.includes("/login") ||
            location.pathname.includes("/register"))
    ) {

        return <Navigate to="/" />;

    }



    return <>{children}</>;
}

export default CheckAuth;
