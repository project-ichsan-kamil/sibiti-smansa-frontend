import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { AUTH_API } from "../../config/ApiConstants";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(AUTH_API.authMe)
      .then(() => {
        setIsAuthenticated(true);
        navigate("/absensi", { replace: true });
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const checkAuthRole = () => {
    api.get(AUTH_API.authMe)
      .then(() => {
        navigate("/absensi", { replace: true });
      })
      .catch(() => {
        setIsAuthenticated(false);
        message.error("Autentikasi gagal. Silakan coba lagi.");
      });
  };

  return { isAuthenticated, isLoading, checkAuthRole };
};

export default useAuth;

