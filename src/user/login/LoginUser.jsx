import React, { useState, useEffect, Fragment } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import image from '../../assets/UserImage';
import { Navigate } from 'react-router-dom';
import api from "../../config/axios";
import useAuth from './userAuth'; 
import Loading from '../../components/template/Loading'
import { AUTH_API } from '../../config/ApiConstants';
import { showErrorNotification } from "../../components/template/Notification";

const LoginUser = () => {
  const { isAuthenticated, checkAuthRole } = useAuth(); 
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/mobile|android|iphone|ipad|ipod/.test(userAgent));
      if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
        setIsSplashVisible(true);
        const timer = setTimeout(() => {
          setIsSplashVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    checkMobile();
  }, []);


  if (isAuthenticated) return <Navigate to="/absensi" replace />;

  const validateInput = () => {
    const newError = {};
    if (!data.email.trim()) newError.email = "Email tidak boleh kosong";
    if (!data.password.trim()) newError.password = "Password tidak boleh kosong";
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setData({ ...data, [field]: value });

    if (error[field]) {
      setError((prevError) => ({ ...prevError, [field]: "" }));
    }

    if (value.trim() === "") {
      setError((prevError) => ({ ...prevError, [field]: `${field === 'email' ? 'Email' : 'Password'} tidak boleh kosong` }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      await checkAuthRole();
    } catch (error) {
      showErrorNotification(error, "Login failed. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col lg:flex-row h-screen">
        {isSplashVisible && isMobile && (
          <div
            className="lg:hidden flex items-center justify-center w-full h-full bg-cover bg-no-repeat bg-center text-white animate-fade-in relative"
            style={{ backgroundImage: `url(${image.welcome})` }}
          >
            <div className="absolute inset-x-0 bottom-28 text-center">
              <h1 className="text-2xl lg:text-3xl font-light">Selamat Datang di</h1>
              <h1 className="text-2xl lg:text-3xl font-bold">CBT SMAN 1 PAYAKUMBUH</h1>
            </div>
          </div>
        )}

        {!isSplashVisible && (
          <>
            {/* Left Section: Image with Text */}
            <div className="hidden lg:w-64 lg:flex flex-col items-center justify-center flex-grow bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${image.welcome})` }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-x-0 bottom-20 bg-opacity-50 flex flex-col items-center justify-center text-white">
                  <h1 className="text-3xl font-light">Selamat Datang di</h1>
                  <h1 className="text-3xl font-bold">CBT SMAN 1 PAYAKUMBUH</h1>
                </div>
              </div>
            </div>

            {/* Right Section: Login Form */}
            <div className="flex-grow flex items-center justify-center bg-white animate-slide-in">
              <div className="w-full max-w-md px-8">
                <div className="flex justify-start mb-4">
                  <img src={image.smansa} alt="School Logo" />
                </div>
                <div className='lg:py-10 py-5 '>
                  <h2 className="text-3xl font-semibold mb-5">Login</h2>
                  <h2 className="text-xl font-normal">Hai, Selamat Datang</h2>
                </div>
                <form className="space-y-4" onSubmit={submitForm}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Masukkan email"
                      value={data.email}
                      onChange={handleInputChange('email')}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm"
                    />
                    {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={data.password}
                        onChange={handleInputChange('password')}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                          {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                        </button>
                      </div>
                    </div>
                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                  </div>
                  <div className="flex items-center justify-end">
                    <a href="/forgot-password" className="text-sm text-active hover:text-hover">
                      Lupa Password?
                    </a>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-active hover:bg-hover text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      {isLoading && <Loading />} {/* Tampilkan loading saat proses login */}
    </Fragment>
  );
};


//rolback
export default LoginUser;




