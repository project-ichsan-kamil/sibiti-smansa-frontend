import React, { Fragment, useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import UserTemplate from '../../components/template/user/UserTemplate';
import { useNavigate } from 'react-router-dom';
import Utils from '../../utils/Utils';
import { fetchExamDetails, checkAnswerExists, startExam } from './hooks/useIntroductionUjian';

const IntroductionUjian = () => {
  const { showLoading, hideLoading } = Utils();
  const examId = window.location.href.split('/').pop();
  const navigate = useNavigate();

  const [examDetails, setExamDetails] = useState({
    title: '',
    examType: '',
    subject: '',
    duration: '',
    sumQuestion: 0,
  });

  const [answerExists, setAnswerExists] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchExamDetails(examId, showLoading, hideLoading, setExamDetails);
      checkAnswerExists(examId, setAnswerExists, showLoading, hideLoading);
    }
  }, [examId]);

  const handleStartExam = async () => {
    startExam(examId, showLoading, hideLoading, navigate);
  };

  return (
    <Fragment>
      <UserTemplate>
        <div className="min-h-screen flex justify-center">
          <div className="w-full">
            <ExamCard examDetails={examDetails} answerExists={answerExists} onStartExam={handleStartExam} />
          </div>
        </div>
      </UserTemplate>
    </Fragment>
  );
};

// Separate component for ExamCard
const ExamCard = ({ examDetails, answerExists, onStartExam }) => (
  <Card className="bg-white rounded-lg shadow-lg">
    <div>
      <h1 className="text-lg font-semibold">
        {examDetails.examType} {examDetails.subject}
      </h1>

      {/* Exam Details */}
      <div className="bg-blue-50 rounded-md p-4 mt-4 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-medium">{examDetails.title}</h2>
          <p className="text-xs text-gray-500">Jumlah soal: {examDetails.sumQuestion} soal</p>
        </div>
        <div className="flex items-center">
          <ClockCircleOutlined className="text-blue-500 mr-2" />
          <span className="text-blue-500 font-semibold text-sm">{examDetails.duration} Menit</span>
        </div>
      </div>

      {/* Exam Rules */}
      <ExamRules />

      {/* Start Button */}
      <div className="mt-6 text-center">
        <Button
          type="primary"
          className={`md:w-40 w-full rounded-full text-white ${
            answerExists ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={onStartExam}
        >
          {answerExists ? 'Lanjutkan' : 'Mulai'}
        </Button>
      </div>
    </div>
  </Card>
);

// Separate component for Exam Rules
const ExamRules = () => (
  <div className="mt-6">
    <h3 className="text-sm font-semibold mb-4">Peraturan Ujian</h3>
    <ul className="text-sm list-decimal list-inside space-y-2 text-gray-700">
      <li className="text-justify">Kehadiran Tepat Waktu: Peserta ujian harus hadir tepat waktu.</li>
      <li className="text-justify">Kelengkapan Alat Tulis: Peserta wajib membawa alat tulis sendiri.</li>
      <li className="text-justify">Kartu Identitas atau Kartu Ujian: Peserta harus membawa kartu identitas.</li>
      <li className="text-justify">Dilarang Membawa Benda Terlarang: Seperti ponsel, tablet, smartwatch, dll.</li>
      <li className="text-justify">Kedisiplinan dalam Ruang Ujian: Peserta harus menjaga ketenangan.</li>
      <li className="text-justify">Pengaturan Waktu Ujian: Peserta diharapkan mematuhi waktu yang diberikan.</li>
      <li className="text-justify">Instruksi Pengawas Ujian: Ikuti semua instruksi dari pengawas ujian.</li>
      <li className="text-justify">Larangan Mencontek: Mencontek atau membantu peserta lain adalah pelanggaran.</li>
    </ul>
  </div>
);

export default IntroductionUjian;


