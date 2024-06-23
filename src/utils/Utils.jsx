import { useState } from 'react';

const Utils = () => {
  const localUrl = "http://localhost:3000"
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return { loading, setLoading, showLoading, hideLoading, localUrl };
};

export default Utils;

