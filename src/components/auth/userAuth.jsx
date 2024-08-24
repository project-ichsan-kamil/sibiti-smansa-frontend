import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me")
      .then((userRes) => {
        setIsAuthenticated(true);
        const roles = userRes.data.roles;
        // Redirect based on role
        if (roles.includes("SISWA")) {
          navigate("/dashboard", { replace: true });
        } else if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) {
          navigate("/cms/dashboard", { replace: true });
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const checkAuthRole = () => {
    api.get("/auth/me")
      .then((userRes) => {
        const roles = userRes.data.roles;
        if (roles.includes("SISWA")) {
          navigate("/dashboard", { replace: true });
        } else if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) {
          navigate("/cms/dashboard", { replace: true });
        } else {
          message.error("Role tidak dikenali. Hubungi admin.");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        message.error("Autentikasi gagal. Silakan coba lagi.");
      });
  };

  return { isAuthenticated, isLoading, checkAuthRole };
};

export default useAuth;
