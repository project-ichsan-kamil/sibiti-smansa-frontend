import React, { Fragment } from 'react';
import { Button, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import UserTemplate from '../../components/template/user/UserTemplate';

const IntroductionUjian = () => {
  return (
    <Fragment>
      <UserTemplate>
        <div className="min-h-screen flex justify-center">
          <div className="w-full">
            <Card className="bg-white rounded-lg shadow-lg">
              <div className="">
                <h1 className="text-lg font-semibold">Kuis Matematika</h1>
                
                {/* Exam Details */}
                <div className="bg-blue-50 rounded-md p-4 mt-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-medium">Pertidaksamaan Linear Dua Variabel</h2>
                    <p className="text-xs text-gray-500">Jumlah Soal : 50 soal</p>
                  </div>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-blue-500 mr-2" />
                    <span className="text-blue-500 font-semibold text-sm">01:45:00</span>
                  </div>
                </div>

                {/* Exam Rules */}

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-4">Peraturan Ujian</h3>
                    <ul className="text-sm list-decimal list-inside space-y-2 text-gray-700">
                        <li className="text-justify">Kehadiran Tepat Waktu: Peserta ujian harus hadir tepat waktu. Biasanya ada batas waktu kapan peserta boleh masuk ke ruang ujian setelah ujian dimulai.
                        </li>
                        <li className="text-justify">
                        Kelengkapan Alat Tulis: Peserta wajib membawa alat tulis sendiri, seperti pensil, pulpen, penghapus, dan kalkulator jika diperlukan.
                        </li>
                        <li className="text-justify">
                        Kartu Identitas atau Kartu Ujian: Peserta harus membawa kartu identitas atau kartu ujian sebagai bukti bahwa mereka terdaftar untuk mengikuti ujian.
                        </li>
                        <li className="text-justify">
                        Dilarang Membawa Benda Terlarang: Perangkat elektronik seperti ponsel, tablet, smartwatch, atau bahan bacaan biasanya dilarang dibawa ke dalam ruang ujian.
                        </li>
                        <li className="text-justify">
                        Kedisiplinan dalam Ruang Ujian: Peserta harus menjaga ketenangan dan tidak boleh mengganggu peserta lain.
                        </li>
                        <li className="text-justify">
                        Pengaturan Waktu Ujian: Peserta diharapkan mematuhi waktu yang diberikan untuk menyelesaikan ujian.
                        </li>
                        <li className="text-justify">
                        Instruksi Pengawas Ujian: Peserta harus mengikuti semua instruksi dari pengawas ujian, termasuk waktu mulai dan selesai ujian.
                        </li>
                        <li className="text-justify">
                        Larangan Mencontek: Mencontek atau membantu peserta lain selama ujian dianggap pelanggaran serius.
                        </li>
                    </ul>
                </div>


                {/* Start Button */}
                <div className="mt-6 text-center">
                  <Button type="primary" className="bg-blue-500 md:w-40 w-full rounded-full text-white hover:bg-blue-600">
                    Mulai
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </UserTemplate>
    </Fragment>
  );
};

export default IntroductionUjian;
