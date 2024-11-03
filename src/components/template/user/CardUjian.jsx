import React from 'react';
import { Card, Button, Progress, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const CardUjian = ({ quiz }) => {
  // Menentukan warna tag status berdasarkan status ujian
  const statusColors = {
    'Selesai': 'green',
    'Belum Dimulai': 'red',
    'Sedang Berlangsung': 'orange'
  };

  return (
    <Card bordered={false} className="shadow-md rounded-lg p-1">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-xs font-medium text-gray-500">Kuis Matematika</p>
          <h2 className="text-md font-semibold mb-1">{quiz.title}</h2>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tag color={statusColors[quiz.status]} className="text-xs">
          {quiz.status}
        </Tag>
        <Button type="primary" className="h-7 text-xs">
          {quiz.status === 'Selesai' ? 'Lihat Hasil' : quiz.status === 'Belum Dimulai' ? 'Mulai' : 'Lanjutkan'}
        </Button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm">{quiz.completedQuestions}/{quiz.totalQuestions} Soal</p>
          <Progress percent={35} status="active" showInfo={false} strokeWidth={10} className="flex-1 mx-2" />
          <p className="text-sm">35%</p>
        </div>
      </div>

      <div className="flex items-center text-gray-400 text-sm mt-4">
        <div className="flex items-center mr-4">
          <CalendarOutlined className="mr-1" />
          <span>{quiz.date}</span>
        </div>
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-1" />
          <span>{quiz.time}</span>
        </div>
      </div>
    </Card>
  );
};

export default CardUjian;

