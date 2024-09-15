import React from 'react';
import UserTemplate from '../../components/template/user/UserTemplate';
const Dashboard = () => {
  return (
    <UserTemplate>
      {/* Dashboard Content */}
      <div className="flex flex-wrap justify-around">
        {/* Laporan Total Kehadiran */}
        <div className="w-full lg:w-2/3 p-4 bg-white shadow rounded-lg">
          <h3 className="text-xl font-bold mb-4">Laporan Total Kehadiran</h3>
          <div className="flex items-center justify-center h-48">
            <p>Grafik Kehadiran</p>
          </div>
        </div>

        {/* Progres Ujian */}
        <div className="w-full lg:w-1/3 p-4 bg-white shadow rounded-lg">
          <h3 className="text-xl font-bold mb-4">Progres Ujian</h3>
          <div className="flex items-center justify-center h-48">
            <p>Grafik Ujian</p>
          </div>
        </div>

        {/* Jadwal Ujian */}
        <div className="w-full p-4 bg-white shadow rounded-lg mt-4">
          <h3 className="text-xl font-bold mb-4">Jadwal Ujian</h3>
          <div className="flex items-center justify-center h-48">
            <p>Detail Jadwal Ujian</p>
          </div>
        </div>
      </div>
    </UserTemplate>
  );
};

export default Dashboard;
