import React from "react";
import { Modal, Tag } from "antd";


const KuisDetailModal = ({ visible, onClose, kuis }) => {
    if (!kuis) return null;

    const convertToIndonesiaTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "WAITING_SUBMITTER":
                return "gold";
            case "PUBLISH":
                return "green";
            case "DRAFT":
                return "default";
            case "CLOSE":
                return "red";
            case "SHOW":
                return "blue";
            default:
                return "default";
        }
    };

    return (
        <Modal
            title={<span className="text-lg font-semibold text-blue-600">Detail Kuis</span>}
            visible={visible}
            onOk={onClose}
            onCancel={onClose}
            centered
            width={700}
            footer={null}
            className="rounded-lg overflow-hidden shadow-lg"
        >
            <div className="px-6 py-4 rounded-lg">
                {/* General Information */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                            <strong>Nama</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.name}</div>
                        
                        <div className="flex justify-between">
                            <strong>Tipe Ujian</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.type}</div>

                        <div className="flex justify-between">
                            <strong>Mulai</strong>
                            <span>:</span>
                        </div>
                        <div>{convertToIndonesiaTime(kuis.startDate)}</div>
                        
                        <div className="flex justify-between">
                            <strong>Durasi</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.duration} Menit</div>
                        
                        <div className="flex justify-between">
                            <strong>Jumlah Soal</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.sumQuestion} Soal</div>

                        <div className="flex justify-between">
                            <strong>KKM</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.passingGrade}</div>
                    </div>
                </div>
                
                <div className="border-t border-gray-300 my-4"></div>

                {/* Date and Status */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                            <strong>Acak Soal</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.randomize ? <Tag color="green">Ya</Tag> :  <Tag color="red">Tidak</Tag>}</div>

                        <div className="flex justify-between">
                            <strong>Status Ujian</strong>
                            <span>:</span>
                        </div>
                        <div>
                            <Tag color={getStatusColor(kuis.statusExam)}>
                                {kuis.statusExam}
                            </Tag>
                        </div>
                        
                        <div className="flex justify-between">
                            <strong>Share Soal</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.shareExam ? <Tag color="green">Ya</Tag> :  <Tag color="red">Tidak</Tag>}</div>
                    </div>
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                            <strong>Mata Pelajaran</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.subject.name}</div>
                        <div className="flex justify-between">
                            <strong>Dibuat Oleh</strong>
                            <span>:</span>
                        </div>
                        <div>{kuis.createdBy}</div>     
                        <div className="flex justify-between">
                            <strong>Peserta</strong>
                            <span>:</span>
                        </div>
                        <div>
                        {kuis.participants.map((participant, index) => (
                            <Tag key={index} color="default">{participant.name}</Tag>
                        ))}
                        </div>                      
                    </div>
                </div>
                {/* Custom Footer */}
                <div className="flex justify-end mt-6">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-md"
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




