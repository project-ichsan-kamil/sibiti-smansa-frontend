import React from 'react';
import { FaBell, FaEllipsisV } from 'react-icons/fa'; // Menggunakan ikon dari react-icons
import image from '../../../assets/UserImage';

const NotificationCard = ({ title, description, time }) => {
  return (
    <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center">
        <img src={image.bell} className='w-12 h-12' alt="bell" />
        <div className="ml-4">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
    
    </div>
  );
};

export default NotificationCard;
