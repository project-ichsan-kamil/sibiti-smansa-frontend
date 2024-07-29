import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = () => (
  <div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
    <LoadingOutlined className="text-white text-4xl" spin style={{color : "blue"}} />
  </div>
);

export default Loading;
