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
  const [position, setPosition] = useState([51.505, -0.09]); //TODO Change default
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
    const payload = {
      latitude: position[0].toString(),
      longitude: position[1].toString(),
      status: status,
      notes: notes,
      image: image ? image.name : null 
    };
  
    try {
      showLoading()
      const response = await api.post('/absents', payload);
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
                   todayStatus === 'EXCUSED' ? 'gold' : 'default'
                 }
                 className="rounded-lg py-1 text-sm font-semibold px-8"
               >
                 {todayStatus === 'LATE' ? 'Terlambat' :
                  todayStatus === 'PRESENT' ? 'Hadir' :
                  todayStatus === 'EXCUSED' ? 'Izin' : ''}
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



