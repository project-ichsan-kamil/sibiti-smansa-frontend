import React from "react";
import { Link } from "react-router-dom";

const NotAuthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-6xl sm:text-8xl font-bold text-white">403</h1>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mt-4">
          Access Denied
        </h2>
        <p className="text-base sm:text-lg text-gray-200 mt-4">
          You do not have permission to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-white text-red-600 rounded-full text-sm sm:text-base font-semibold shadow-md hover:bg-gray-100 transition duration-200"
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

export default NotAuthorizedPage;
