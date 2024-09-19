import React from "react";
import { Modal } from "antd";

const KuisDetailModal = ({ visible, onClose, kuis }) => {
    if (!kuis) return null;

    const convertToIndonesiaTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
        });
    };

    return (
        <Modal
            title={<span className="text-lg font-semibold">Detail Kuis</span>}
            visible={visible}
            onOk={onClose}
            onCancel={onClose}
            okText="Tutup"
            centered
            width={700}
            footer={null} // Remove default footer to add custom buttons
        >
            <div className="px-4 py-4">
                {/* General Information */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Nama Kuis:</strong> {kuis.name}
                        </div>
                        <div>
                            <strong>Tipe Kuis:</strong> {kuis.type}
                        </div>
                        <div>
                            <strong>Durasi:</strong> {kuis.duration} Menit
                        </div>
                        <div>
                            <strong>Jumlah Soal:</strong> {kuis.sumQuestion} Soal
                        </div>
                        <div>
                            <strong>Acak Soal:</strong> {kuis.randomize ? "Ya" : "Tidak"}
                        </div>
                        <div>
                            <strong>Passing Grade:</strong> {kuis.passingGrade}
                        </div>
                    </div>
                </div>
                
                {/* Date and Status */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Tanggal Mulai:</strong> {convertToIndonesiaTime(kuis.startDate)}
                        </div>
                        <div>
                            <strong>Status Ujian:</strong> {kuis.statusExam}
                        </div>
                        <div>
                            <strong>Share:</strong> {kuis.shareExam ? "Ya" : "Tidak"}
                        </div>
                    </div>
                </div>
                
                {/* Creator Information */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Dibuat Oleh:</strong> {kuis.createdBy}
                        </div>
                        <div>
                            <strong>Tanggal Dibuat:</strong> {convertToIndonesiaTime(kuis.createdAt)}
                        </div>
                    </div>
                </div>
                
                {/* Emergency Contact Section */}
                <div className="mb-4">
                    <div className="text-lg font-semibold mb-2">Emergency Contact</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Nama:</strong> Budi Jaya
                        </div>
                        <div>
                            <strong>Handphone:</strong> 089765544321
                        </div>
                        <div>
                            <strong>Relation:</strong> Father
                        </div>
                    </div>
                </div>

                {/* Custom Footer */}
                <div className="flex justify-end">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default KuisDetailModal;


