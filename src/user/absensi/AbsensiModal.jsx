import React from 'react';
import { Modal, Select, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AbsensiModal = ({ visible, onClose, currentDate, currentTime, status, setStatus, notes, setNotes, image, setImage, handleSave, isAccurateEnough }) => {
  return (
    <Modal
      visible={visible}
      title="Konfirmasi Kehadiran"
      centered
      onCancel={onClose}
      footer={null}
      bodyStyle={{ padding: '24px' }}
    >
      {/* Date and Time Display */}
      <div className="mb-4 text-gray-500">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-medium">Tanggal</td>
              <td>:</td>
              <td className="font-bold">{currentDate}</td>
            </tr>
            <tr>
              <td className="font-medium">Jam</td>
              <td>:</td>
              <td className="font-bold">{currentTime}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Dropdown */}
      <div className="my-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Status:</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          className="w-full"
        >
          <Select.Option value="PRESENT">HADIR</Select.Option>
          <Select.Option value="IZIN">IZIN</Select.Option>
          <Select.Option value="SAKIT">SAKIT</Select.Option>
        </Select>
      </div>

      {/* Notes and Image input for Izin and Sakit */}
      {(status === 'IZIN' || status === 'SAKIT') && (
        <>
          <div className="my-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Catatan:</label>
            <Input.TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan..."
            />
          </div>
          <div className="my-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Bukti (Gambar):</label>
            <Upload
              beforeUpload={(file) => {
                setImage(file);
                return false; // Prevent automatic upload
              }}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
            </Upload>
          </div>
        </>
      )}

      {/* Save/Absen Button */}
      <div className="mt-6 flex justify-end">
        <Button
          type="primary"
          className="w-full rounded-full"
          onClick={handleSave}
          disabled={status === 'HADIR' && !isAccurateEnough}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default AbsensiModal;
