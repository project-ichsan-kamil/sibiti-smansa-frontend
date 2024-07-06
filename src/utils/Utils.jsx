import { useState } from 'react';

const Utils = () => {
  const localUrl = "http://localhost:3001"
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

  return { loading, setLoading, showLoading, hideLoading, localUrl, getHeaders};
};

export default Utils;

