import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../config/axios";
import { AUTH_API } from "../../config/ApiConstants";
import Loading from "../template/Loading";
import { useAuthContext } from "../../context/useContext";

const PrivateRoute = ({ children, allowedRoles }) => {   
  const {currentUser ,setCurrentUser} = useAuthContext()           
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    api.get(AUTH_API.authMe)
      .then((response) => {
        console.log("Log response form get auth");
        console.log(response);
        setIsAuthenticated(true);
        setUserRoles(response.data.roles || []);
        setCurrentUser({ ...currentUser, fullName: response.data.fullName, roles: response.data.roles });
      })
      .catch((err) => {
        console.log("error auth");
        console.log(err);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
    
    console.log(isAuthenticated);
  }, []);

  if (isLoading) {
    return <Loading/>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => userRoles.includes(role))) {
    console.log("allowedRoles");
    console.log(allowedRoles);
    console.log("user roles");
    console.log(userRoles);
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default PrivateRoute;
