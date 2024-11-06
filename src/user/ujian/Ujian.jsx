import React, { useState, useEffect, Fragment } from 'react';
import Draggable from 'react-draggable';
import { Layout, Button } from 'antd';
import { ClockCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import UserTemplate from '../../components/template/user/UserTemplate';

const { Content } = Layout;

const Ujian = () => {
  const [timeLeft, setTimeLeft] = useState(105 * 60); // Set waktu awal (105 menit dalam detik)
  const [showQuestionList, setShowQuestionList] = useState(false); // State untuk toggle list nomor soal
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };

  return (
    <Fragment>
      <div className="min-h-screen p-4 relative">
        {/* Draggable Timer with Toggle Button */}
        <Draggable bounds="parent">
          <div className="fixed bottom-4 right-4 bg-default text-active border border-active p-2 rounded-lg shadow-lg cursor-move z-50 flex items-center">
            <span className="flex items-center mr-4">
              <ClockCircleOutlined className="mr-2" />
              <span className="text-md font-semibold">{formatTime(timeLeft)}</span>
            </span>
            <Button
              icon={showQuestionList ? <CloseOutlined /> : <MenuOutlined />}
              size='small'
              type="primary"
              shape="circle"
              onClick={() => setShowQuestionList(!showQuestionList)}
              className="bg-white text-blue-500"
            />
          </div>
        </Draggable>

        {/* List nomor soal */}
        <div
          className={`fixed top-0 right-0 bg-white h-full z-40 shadow-lg transition-transform duration-300 ease-in-out ${
            showQuestionList ? 'transform translate-x-0' : 'transform translate-x-full'
          } sm:relative sm:translate-x-0 sm:block`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="text-md font-semibold">Daftar Soal</h4>
            <Button
              icon={<ArrowRightOutlined />}
              type="text"
              className="text-blue-500"
              onClick={() => setShowQuestionList(false)}
            >
              Tutup
            </Button>
          </div>
          <div className="mb-6 flex flex-wrap justify-center gap-1 p-4">
            {[...Array(50).keys()].map((_, index) => (
              <div
                key={index}
                className={`w-10 h-10 text-sm flex items-center justify-center font-medium rounded-md border ${
                  index === 12 ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg">
          <div className="p-2 rounded-lg mb-6">
            <h3 className="text-sm font-medium mb-3">Soal 1</h3>
            <p className="mb-5 text-sm">Alveolus adalah bagian dari sistem pernapasan yang berfungsi untuk?</p>
            
            {/* Custom Radio Buttons */}
            <div className="w-full space-y-3">
              {[1, 2, 3, 4].map((value, index) => (
                <label
                  key={index}
                  className={`w-full p-2 text-sm border rounded-md cursor-pointer block ${
                    selectedValue === value ? 'bg-active text-white' : 'bg-default'
                  }`}
                  onClick={() => handleOptionClick(value)}
                >
                  <input
                    type="radio"
                    name="question"
                    value={value}
                    className="hidden"
                    checked={selectedValue === value}
                    onChange={() => {}}
                  />
                  Menyaring udara dari kotoran {/* Ubah teks sesuai dengan kebutuhan */}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button icon={<ArrowLeftOutlined />} className="bg-gray-200 text-gray-600 hover:bg-gray-300">
            </Button>

            {/* Checkbox for "Ragu-Ragu" */}
            <label className="flex items-center cursor-pointer text-sm">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              Ragu-Ragu
            </label>

            <Button icon={<ArrowRightOutlined />} className="bg-gray-200 text-gray-600 hover:bg-gray-300">
            </Button>
          </div>

          <div className="flex justify-end mt-6 hidden">
            <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
              Selesai
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Ujian;



