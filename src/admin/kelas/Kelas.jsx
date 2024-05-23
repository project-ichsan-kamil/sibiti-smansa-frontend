import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input, Button, Space, Modal, Form, message } from "antd";
import CmsTemplate from '../../components/CmsTemplate'
import KelasService from "../../api/admin/KelasApi";
import Utils from "../../utils/Utils";
import Loading from "../../components/Loading"
import ModalPopup from "../../components/ConfirmModal";
import kelasHooks from "./hooks/kelasHooks";

const { Option } = Select;
const { Search } = Input;

const Kelas = () => {
    //form data
    const [form] = Form.useForm();
    const [kelasData, setKelasData] = useState([]);

    //hooks
    const { handleEdit, showModal, closeModal, fetchData, deleteData,
        searchKelas, handleSubmit,
        loading, isModalVisible } = kelasHooks(form, setKelasData)

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);


    const columns = [
        {
            title: "No",
            dataIndex: "id",
            key: "id",
            width: "3%",
            render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "30%",
        },
        {
            title: "Last Updated",
            dataIndex: "updatedBy",
            key: "updatedBy",
            width: "10%",
            align: 'center'

        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            align: 'center',
            render: (status) => (
                <p style={{ color: status === 'Aktif' ? 'green' : 'red' }}>
                    {status}
                </p>
            )
        },
        {
            title: "Action",
            key: "id",
            render: (text, record) => (
                <Space size="small">
                    <Button
                        // key={record.id}
                        key={`delete-${record.id}`}
                        onClick={() => ModalPopup({
                            title: "Apakah anda ingin hapus kelas ini?",
                            onOk: () => {
                                deleteData(record.id);
                            },
                            content: "Klik Ok untuk hapus data",
                        }).showConfirm()
                        }
                        danger
                    >
                        Delete
                    </Button>
                    <Button
                        key={`edit-${record.id}`}
                        onClick={() => handleEdit(record.id)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
            width: "10%",
        },
    ];

    return (
        <Fragment>
            <CmsTemplate>

                <div>
                    <h1 className="text-2xl font-semibold">Kelas</h1>
                    <div className="flex w-full justify-between mt-6 mb-4">
                        <Select
                            defaultValue="10"
                            style={{ width: 80 }}
                            onChange={(value) => setPageSize(value)}
                        >
                            <Option value="10">10</Option>
                            <Option value="25">25</Option>
                            <Option value="50">50</Option>
                        </Select>

                        <div className="space-x-2">
                            <Button type="primary" onClick={showModal}>Tambah</Button>
                            <Search
                                placeholder="Cari kelas"
                                allowClear
                                onChange={(e) => searchKelas(e)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={kelasData}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            onChange: (page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            },
                            showSizeChanger: false, position: ["bottomCenter"]
                        }}
                        size="small"
                    />

                    <Modal
                        title="Tambah Kelas"
                        visible={isModalVisible}
                        onOk={handleSubmit} // Mengubah handleOk menjadi handleSubmit
                        onCancel={closeModal}
                        okText="Simpan"
                        cancelText="Batal"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="id"
                                label="id"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="nama"
                                label="Nama"
                                rules={[{ required: true, message: 'Masukkan nama kelas' }]}
                            >
                                <Input disabled={form.getFieldValue('id') ? true : false} />
                            </Form.Item>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Pilih status kelas' }]}
                            >
                                <Select>
                                    <Option value="Aktif">Aktif</Option>
                                    <Option value="Tidak Aktif">Tidak Aktif</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                </div>
            </CmsTemplate>

            {loading && <Loading />}
        </Fragment>
    );
};

export default Kelas;


