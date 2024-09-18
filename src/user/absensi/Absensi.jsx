import React, { useState, useEffect } from 'react';
import UserTemplate from '../../components/template/user/UserTemplate';

const Absensi = () => {
  const [position, setPosition] = useState([51.505, -0.09]); //TODO Change default
  const [accuracy, setAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Mengambil lokasi...');
  const [statusBgColor, setStatusBgColor] = useState('bg-gray-500'); // Default background color (gray)
  const [isAccurateEnough, setIsAccurateEnough] = useState(false);

  // Fungsi untuk mengambil posisi GPS menggunakan Geolocation API
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          setPosition([latitude, longitude]);
          setAccuracy(accuracy);

          console.log('Latitude:', latitude, 'Longitude:', longitude, 'Accuracy:', accuracy);

          // Mengecek akurasi dan menampilkan status
          if (accuracy <= 100) {
            setIsAccurateEnough(true);
            setStatusBgColor('bg-green-500'); // Hijau untuk akurat
            setLocationStatus('Lokasi sangat akurat. Siap untuk absen.');
          } else if (accuracy > 100 && accuracy <= 350) {
            setIsAccurateEnough(true);
            setStatusBgColor('bg-yellow-500'); // Kuning untuk cukup akurat
            setLocationStatus('Lokasi cukup akurat.');
          } else if (accuracy > 350 && accuracy <= 600) {
            setIsAccurateEnough(false);
            setStatusBgColor('bg-red-500'); // Merah untuk akurasi lemah
            setLocationStatus('Lokasi lemah. Tunggu sampai lebih akurat.');
          } else {
            setIsAccurateEnough(false);
            setStatusBgColor('bg-red-500'); // Merah untuk sangat lemah
            setLocationStatus(`Akurasi lokasi: ${Math.floor(accuracy)}m. Lokasi terlalu lemah.`);
          }

        },
        (error) => {
          setLocationStatus('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('Geolocation tidak didukung di browser ini.');
    }
  };

  // Jalankan getLocation saat pertama kali halaman dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // Fungsi untuk melakukan absen
  const handleCheckIn = () => {
    if (isAccurateEnough && position) {
      alert(`Absen berhasil dilakukan!\nKoordinat Anda: \nLatitude: ${position[0]}, Longitude: ${position[1]}`);
    } else {
      alert('Lokasi belum cukup akurat untuk absen.');
    }
  };

  return (
    <UserTemplate>
      <div className="flex flex-col h-screen relative -m-2" style={{ height: 'calc(100vh - 5em)' }}>

        {/* Status Akurasi Lokasi */}
        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-50 p-2 text-center lg:w-7/12 w-10/12 text-sm rounded-lg text-white ${statusBgColor}`}>
          {locationStatus}
        </div>

        {/* Peta Google Maps */}
        <div className="flex-grow">
          <iframe
            src={`https://www.google.com/maps?q=${position[0]},${position[1]}&z=15&output=embed`}
            width="100%"
            className="h-full"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Tombol Absen */}
        <div className="flex-shrink-0 p-4 bg-white shadow rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Kehadiran</p>
              <p>19 Agustus 2024 - 07:45</p>
            </div>
            <button
              onClick={handleCheckIn}
              className={`px-4 py-2 text-white rounded-lg ${isAccurateEnough ? 'bg-blue-500' : 'bg-gray-400'}`}
              disabled={!isAccurateEnough}
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </UserTemplate>
  );
};

export default Absensi;



