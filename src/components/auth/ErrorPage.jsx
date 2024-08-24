import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-8xl sm:text-9xl font-bold text-white">404</h1>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mt-4">
          Oops! Page not found
        </h2>
        <p className="text-base sm:text-lg text-gray-200 mt-4">
          The page you are looking for doesn’t exist. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-white text-blue-600 rounded-full text-sm sm:text-base font-semibold shadow-md hover:bg-gray-100 transition duration-200"
        >
          Back to Home
        </Link>
      </div>
      <div className="absolute bottom-4 text-gray-300 text-xs sm:text-sm text-center w-full">
        &copy; {new Date().getFullYear()} SMA 1 Payakumbuh. All rights reserved. 
        <br />
        Proudly serving education in Payakumbuh since 1955.
      </div>
    </div>
  );
};

export default ErrorPage;
