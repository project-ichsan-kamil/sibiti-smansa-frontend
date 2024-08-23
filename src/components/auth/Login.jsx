import React, { Fragment, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";
import Loading from "../template/Loading";
import api from "../../config/axios";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isAuthenticated) return <Navigate to="/cms/dashboard" replace />;

  const validateInput = () => {
    const newError = {};
    if (!data.email.trim()) newError.email = "Email is required";
    if (!data.password.trim()) newError.password = "Password is required";
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setIsLoading(true);

    api.post("/auth/login", data)
      .then((res) => {
        message.success(res.data.message);
        window.location.href = "/cms/dashboard";
      })
      .catch((err) => message.error(err.response?.data?.message || "Login failed"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Fragment>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form onSubmit={submitForm}>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
                    />
                    {error.email && <p className="text-red-500 text-xs">{error.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
                    />
                    {error.password && <p className="text-red-500 text-xs">{error.password}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-500">
                      <input
                        type="checkbox"
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2"
                      />
                      Show password
                    </label>
                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-5 py-2.5">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {isLoading && <Loading />}
    </Fragment>
  );
};

export default Login;
