import { useState } from 'react';

const Utils = () => {
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return { loading, setLoading, showLoading, hideLoading };
};

export default Utils;

