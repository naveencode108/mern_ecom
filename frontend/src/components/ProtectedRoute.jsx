import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  // const isLoggedIn = localStorage.getItem("login_token");
  const isLoggedIn = sessionStorage.getItem("login_token");
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
