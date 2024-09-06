import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../config/axios";
import { AUTH_API } from "../../config/ApiConstants";

const PrivateRoute = ({ children, allowedRoles }) => {                  //TODO handle expired token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    api.get(AUTH_API.authMe)
      .then((response) => {
        setIsAuthenticated(true);
        setUserRoles(response.data.roles || []);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default PrivateRoute;
