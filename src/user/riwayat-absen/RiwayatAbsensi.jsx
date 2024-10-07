
import React, { useState, useEffect, Fragment } from 'react';
import { Calendar, Modal, Select } from 'antd';
import { format, isSameDay } from 'date-fns';
import UserTemplate from '../../components/template/user/UserTemplate';
import api from '../../config/axios';

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
      <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
        <Select
          value={value.year()}
          onChange={(newYear) => {
            setSelectedYear(newYear); // Update state for year
            const newValue = value.clone().year(newYear);
            onChange(newValue);
          }}
          style={{ width: 100 }}
        >
          {yearOptions}
        </Select>

        <Select
          value={value.month()}
          onChange={(newMonth) => {
            setSelectedMonth(newMonth + 1); // Update state for month
            const newValue = value.clone().month(newMonth);
            onChange(newValue);
          }}
          style={{ width: 120 }}
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
          <h1>Riwayat Absensi</h1>
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
            title={`Absensi pada ${selectedDate ? format(selectedDate, 'PP') : ''}`}
            visible={modalVisible}
            onCancel={handleModalClose}
            footer={null}
          >
            {attendanceDetails.length > 0 ? (
              <ul>
                {attendanceDetails.map((detail) => (
                  <li key={detail.id}>
                    <p>{`Waktu: ${format(new Date(detail.date), 'HH:mm')}`}</p>
                    <p>{`Status: ${detail.status}`}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada absensi pada tanggal ini.</p>
            )}
          </Modal>
        </div>
      </UserTemplate>
    </Fragment>
  );
};

export default RiwayatAbsensi;
