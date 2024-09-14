import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import image from '../assets/UserImage';

const LoginPage = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSplashVisible(true);
        const timer = setTimeout(() => {
          setIsSplashVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
    {isSplashVisible && isMobile && (
      <div
        className="lg:hidden flex items-center justify-center w-full h-full bg-cover bg-no-repeat bg-center text-white animate-fade-in relative"
        style={{ backgroundImage: `url(${image.welcome})` }}
      >
        <div className="absolute inset-x-0 bottom-28 text-center">  {/* Menggunakan absolute positioning */}
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
                <img
                  src={image.smansa}
                  alt="School Logo"
                />
              </div>
              <div className='lg:py-10 py-5 '>
                <h2 className="text-3xl font-semibold mb-5">Login</h2>
                <h2 className="text-xl font-normal">Hai, Selamat Datang</h2>
              </div>
              {/* <h2 className="text-3xl font-semibold mb-6">Hai, Selamat Datang</h2> */}
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm"
                  />
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
                      required
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-500 border-blue-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                  </label>
                  <a href="#" className="text-sm text-active hover:text-hover">
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
  );
};

export default LoginPage;


