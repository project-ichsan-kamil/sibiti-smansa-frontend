import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/UserImage';
import Utils from '../../utils/Utils';
import { showErrorNotification, showSuccessNotification } from '../../components/template/Notification';
import Loading from '../../components/template/Loading';
import api from '../../config/axios';

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const {showLoading, hideLoading, loading} = Utils()

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (error) {
      setError('');
    }

    if (value.trim() === '') {
      setError('Email tidak boleh kosong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      setError('Email tidak boleh kosong');
      return;
    }

    showLoading()
    try {
      const response = await api.post('/auth/forgot-password', { email });
      showSuccessNotification("Success", response.data.message)
    } catch (error) {
      showErrorNotification(error, "Gagal mengirimkan email forgot password")
    } finally {
      hideLoading()
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div
        className="hidden w-80 lg:flex flex-grow flex-shrink items-center justify-center bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${image.welcome})` }}  
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-x-0 bottom-20 bg-opacity-50 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-light">Selamat Datang di</h1>
            <h1 className="text-3xl font-bold">CBT SMAN 1 PAYAKUMBUH</h1>
          </div>
        </div>
      </div>

      {/* Right Section: Change Password Form */}
      <div className="flex-grow flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          <div className="flex justify-start mb-4">
            <img
              src={image.smansa} // Gambar logo sekolah, ganti dengan gambar yang sesuai
              alt="School Logo"
            />
          </div>
          <div className='lg:py-10 py-5'>
            <h2 className="text-3xl font-normal mb-5">Lupa Password</h2>
            <p className="text-sm text-gray-400 font-normal text-justify">Jika Anda memerlukan bantuan untuk mengatur ulang password Anda, kami dapat membantu dengan mengirimkan Anda tautan untuk mengatur ulang password Anda.</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className='space-y-2'>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-active hover:bg-hover text-white font-normal rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Kirim Email
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-2 px-4 bg-white border border-active text-active hover:bg-active hover:text-white font-normal rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <Loading/>}
    </div>
  );
};

export default ForgotPassword;

