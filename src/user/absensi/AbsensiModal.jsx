import React from 'react';
import { Modal, Select, Input, Button, Upload, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AbsensiModal = ({ visible, onClose, currentDate, currentTime, status, setStatus, notes, setNotes, image, setImage, handleSave, isAccurateEnough }) => {

  const onFinish = () => {
    if ((status === 'SICK' || status === 'EXCUSED') && (!notes || !image)) {
      message.error("Catatan dan lampiran harus diisi!");
      return; 
    }

    handleSave();
  };

  return (
    <Modal
      visible={visible}
      title="Konfirmasi Kehadiran"
      centered
      onCancel={onClose}
      footer={null}
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

      {/* Form */}
      <Form layout="vertical" onFinish={onFinish}>
        {/* Status Dropdown */}
        <Form.Item label="Status" required>
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            className="w-full"
          >
            <Select.Option value="PRESENT">HADIR</Select.Option>
            {/* <Select.Option value="EXCUSED">IZIN</Select.Option>
            <Select.Option value="SICK">SAKIT</Select.Option> */}
          </Select>
        </Form.Item>

        {/* Notes and Image input for Izin and Sakit */}
        {(status === 'SICK' || status === 'EXCUSED') && (
          <>
            <Form.Item
              label="Catatan"
              required
              rules={[{ required: true, message: 'Catatan harus diisi!' }]}
            >
              <Input.TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan..."
              />
            </Form.Item>

            <Form.Item
              label="Lampiran"
              required
              rules={[{ required: true, message: 'Bukti file harus di-upload!' }]}
            >
              <Upload
                beforeUpload={(file) => {
                  setImage(file);
                  return false; // Prevent automatic upload
                }}
                accept="*/*"
              >
                <Button icon={<UploadOutlined />}>Pilih file</Button>
              </Upload>
            </Form.Item>
          </>
        )}

        {/* Save/Absen Button */}
        {console.log(isAccurateEnough)}
        <Form.Item>
          <Button
            type="primary"
            className="w-full rounded-full"
            htmlType="submit" // Mengubah tombol untuk submit form
            disabled={status === 'HADIR' && !isAccurateEnough}
          >
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AbsensiModal;

