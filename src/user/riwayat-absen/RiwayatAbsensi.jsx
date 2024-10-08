
import React, { useState, useEffect, Fragment } from 'react';
import { Calendar, Modal, Select } from 'antd';
import { format, isSameDay } from 'date-fns';
import UserTemplate from '../../components/template/user/UserTemplate';
import api from '../../config/axios';
import { id } from 'date-fns/locale';

const RiwayatAbsensi = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  // Function to fetch attendance data from API
  const fetchAttendance = async (month, year) => {
    try {
      const response = await api.get('/absents/monthly', {
        params: {
          month: month,
          year: year,
        }
      });

      // Format data yang diterima dari API
      const formattedData = response.data.data.map((attendance) => ({
        ...attendance,
        date: new Date(attendance.date),
      }));

      setEvents(formattedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleDateClick = (date) => {
    const selected = events.filter((event) => isSameDay(event.date, date));
    setAttendanceDetails(selected);
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setAttendanceDetails([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'green'; 
      case 'SICK':
        return 'blue'; 
      case 'LATE':
        return 'red'; 
      case 'EXCUSED':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const convertStatus = (status) => {
    switch (status) {
        case 'PRESENT':
            return 'HADIR';
        case 'SICK':
            return 'SAKIT';
        case 'LATE':
            return 'TERLAMBAT';
        case 'EXCUSED':
            return 'IZIN';
        default:
            return status;
    }
};

  

  const customHeaderRender = ({ value, onChange }) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];

    for (let i = currentYear; i >= currentYear - 4; i--) {
      yearOptions.push(
        <Select.Option key={i} value={i}>
          {i}
        </Select.Option>
      );
    }

    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    return (
      <div className='flex py-2 space-x-2'>
        <Select
          className='w-1/2 md:w-32'
          value={value.year()}
          onChange={(newYear) => {
            setSelectedYear(newYear); // Update state for year
            const newValue = value.clone().year(newYear);
            onChange(newValue);
          }}
        >
          {yearOptions}
        </Select>

        <Select
          className='w-1/2 md:w-36'
          value={value.month()}
          onChange={(newMonth) => {
            setSelectedMonth(newMonth + 1); // Update state for month
            const newValue = value.clone().month(newMonth);
            onChange(newValue);
          }}
        >
          {months.map((month, index) => (
            <Select.Option key={index} value={index}>
              {month}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  };

  return (
    <Fragment>
      <UserTemplate>
        <div>
          <h1 className='text-lg font-semibold'>Riwayat Absensi</h1>
          <Calendar
            onSelect={handleDateClick}
            headerRender={customHeaderRender}
            dateCellRender={(date) => {
              const dayEvents = events.filter((event) => isSameDay(event.date, date));
              return (
                <div className="flex justify-center">
                  {dayEvents.map((event) => (
                    <div
                      className="h-10 w-10 flex items-center justify-center rounded-full"
                      key={event.id}
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    ></div>
                  ))}
                </div>
              );
            }}
          />


<Modal
  title={<div style={{ textAlign: 'center' }}>Detail Absensi</div>} 
  visible={modalVisible}
  onCancel={handleModalClose}
  footer={null}
>
{attendanceDetails.length > 0 ? (
    <div>
      {attendanceDetails.map((detail) => {
        const currentDate = format(new Date(detail.date), 'dd MMMM yyyy', { locale: id });
        const currentTime = format(new Date(detail.date), 'HH:mm'); // Format jam
        return (
          <div key={detail.id} style={{ marginBottom: '20px' }}>
            <div className="mb-4 text-gray-500">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-normal">Tanggal</td>
                    <td>:</td>
                    <td className="font-semibold">{currentDate}</td>
                  </tr>
                  <tr>
                    <td className="font-normal">Jam</td>
                    <td>:</td>
                    <td className="font-semibold">{currentTime}</td>
                  </tr>
                  <tr>
                    <td className="font-normal">Status</td>
                    <td>:</td>
                    <td className="font-semibold">{convertStatus(detail.status)}</td>
                  </tr>
                  {detail.notes && (
                    <tr>
                      <td className="font-normal">Catatan</td>
                      <td>:</td>
                      <td className="font-semibold">{detail.notes}</td>
                    </tr>
                  )}
                  {detail.urlFile && (
                    <tr>
                      <td className="font-normal">File</td>
                      <td>:</td>
                      <td className="font-semibold">
                        <a href={detail.urlFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          Lihat File
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <iframe
              src={`https://www.google.com/maps?q=${detail.latitude},${detail.longitude}&z=15&output=embed`}
              width="100%"
              height="300" // Adjust the height as needed
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        );
      })}
    </div>
  ) : (
    <p className='text-center my-10'>Tidak ada absensi pada tanggal ini.</p>
  )}

</Modal>


        </div>
      </UserTemplate>
    </Fragment>
  );
};

export default RiwayatAbsensi;
