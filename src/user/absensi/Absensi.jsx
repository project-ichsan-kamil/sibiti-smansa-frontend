import React, { useState, useEffect } from 'react';
import UserTemplate from '../../components/template/user/UserTemplate';
import api from "../../config/axios";
import {Tag} from 'antd';
import { showSuccessNotification, showErrorNotification} from '../../components/template/Notification';
import Loading from '../../components/template/Loading';
import Utils from '../../utils/Utils';
import AbsensiModal from './AbsensiModal';

const Absensi = () => {
  const { showLoading, hideLoading, loading } = Utils();
  const [position, setPosition] = useState([-6.129823, 106.879966]); // Koordinat pusat absensi
  const [accuracy, setAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Mengambil lokasi...');
  const [statusBgColor, setStatusBgColor] = useState('bg-gray-500'); // Default background color (gray)
  const [isAccurateEnough, setIsAccurateEnough] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('PRESENT');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);

  const [todayStatus, setTodayStatus] = useState(null); 
  const [todayDate, setTodayDate] = useState('');
  const [todayTime, setTodayTime] = useState('')

  const CENTER_COORDS = { latitude: -6.129823, longitude: 106.879966 };
  const RADIUS = 300; // Radius 300 meter

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          setPosition([latitude, longitude]);
          setAccuracy(accuracy);

          console.log('Latitude:', latitude, 'Longitude:', longitude, 'Accuracy:', accuracy);

          // Mengecek jarak dengan pusat dan tambahkan akurasi untuk menentukan absensi
          const distance = calculateDistance(latitude, longitude);
          const totalDistance = distance + accuracy;
          setIsAccurateEnough(totalDistance <= RADIUS);
          console.log(totalDistance);

          if (totalDistance <= RADIUS) {
            setStatusBgColor('bg-green-500');
            setLocationStatus('Lokasi siap untuk absen.');
          } else {
            setStatusBgColor('bg-red-500');
            setLocationStatus(`Lokasi tidak memenuhi syarat untuk absen. Jarak total: ${Math.floor(totalDistance)}m.`);
          }
        },
        (error) => {
          setLocationStatus('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 100 }
      );
    } else {
      setLocationStatus('Geolocation tidak didukung di browser ini.');
    }
  };

  const calculateDistance = (latitude, longitude) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Radius bumi dalam meter
    const dLat = toRad(latitude - CENTER_COORDS.latitude);
    const dLon = toRad(longitude - CENTER_COORDS.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(CENTER_COORDS.latitude)) *
      Math.cos(toRad(latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  useEffect(() => {
    getLocation();
    checkTodayStatus();
  
    // Get current date and time
    const date = new Date();
    const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);  

  const handleCheckIn = () => {
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const formData = new FormData(); // Buat FormData untuk meng-upload file

    // Menambahkan data ke FormData
    formData.append('latitude', position[0].toString());
    formData.append('longitude', position[1].toString());
    formData.append('status', status);
    formData.append('notes', notes);
    if (image) {
      formData.append('file', image); // Menggunakan 'file' sebagai nama field untuk file
    }
  
    try {
      showLoading()
      const response = await api.post('/absents', formData ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccessNotification("Success", "Absensi berhasil")
      checkTodayStatus();
    } catch (error) {
      showErrorNotification(error, "Gagal untuk absensi");
    } finally {
      hideLoading()
      setIsModalOpen(false); 
    }
  };

  const checkTodayStatus = async () => {
    try {
      showLoading();
      const response = await api.get('/absents/check-today');
      if (response.data.data) {
        setTodayStatus(response.data.data.status);
        setTodayDate(response.data.data.date);
        setTodayTime(response.data.data.time)
      }
    } catch (error) {
      showErrorNotification(error, "Gagal untuk absensi");
    } finally {
      hideLoading();
    }
  };
    

  return (
    <UserTemplate>
      <div className="flex flex-col h-screen relative -m-2" style={{ height: 'calc(100vh - 5em)' }}>

        {/* Status Akurasi Lokasi */}
        {!todayStatus && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-50 p-2 text-center lg:w-7/12 w-10/12 text-sm rounded-lg text-white ${statusBgColor}`}>
            {locationStatus}
          </div>
        )}

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
              <div>
                <p className="font-semibold">Kehadiran</p>
                <p>{todayStatus && todayDate ? `${todayDate} - ${todayTime}` : `${currentDate} - ${currentTime}`}</p>
              </div>
            </div>
            {todayStatus ? (
                 <Tag
                 color={
                   todayStatus === 'LATE' ? 'red' :
                   todayStatus === 'PRESENT' ? 'green' :
                   todayStatus === 'EXCUSED' ? 'gold' : 'blue'
                 }
                 className="rounded-lg py-1 text-sm font-semibold px-8"
               >
                 {todayStatus === 'LATE' ? 'Terlambat' :
                  todayStatus === 'PRESENT' ? 'Hadir' :
                  todayStatus === 'EXCUSED' ? 'Izin' : 'Sakit'}
               </Tag>
               
              ) : (
                <button
                  onClick={handleCheckIn}
                  className={`px-4 py-2 text-white rounded-lg ${isAccurateEnough ? 'bg-blue-500' : 'bg-gray-400'}`}
                  disabled={!isAccurateEnough}
                >
                  Check In
                </button>
              )}

          </div>
        </div>
      </div>

      {isModalOpen && (
        <AbsensiModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentDate={currentDate}
        currentTime={currentTime}
        status={status}
        setStatus={setStatus}
        notes={notes}
        setNotes={setNotes}
        image={image}
        setImage={setImage}
        handleSave={handleSave}
        isAccurateEnough={isAccurateEnough}
      />
      )}

      {loading && <Loading/>}

    </UserTemplate>
  );
};

export default Absensi;

