import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input, Button, Space, Modal, Form } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CmsTemplate from '../../components/CmsTemplate';
import Loading from "../../components/Loading";
import ModalPopup from "../../components/ConfirmModal";
import mataPelajaranHooks from "./hooks/mataPelajaranHooks";

const { Option } = Select;
const { Search } = Input;

const MataPelajaran = () => {
    // Form data
    const [form] = Form.useForm();
    const [mataPelajaranData, setMataPelajaranData] = useState([]);

    // Hooks
    const { handleEdit, showModal, closeModal, fetchData, deleteData, searchMataPelajaran, handleSubmit, loading, isModalVisible } = mataPelajaranHooks(form, setMataPelajaranData);

    // Pagination
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
            align: "center",
            render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "30%",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            align: 'center',
            render: (status) => (
                <p style={{ color: status === 1 ? 'green' : 'red' }}>
                    {status === 1 ? "Aktif" : "Tidak Aktif"}
                </p>
            ),
        },
        {
            title: "Action",
            align: "center",
            key: "id",
            render: (text, record) => (
                <Space size="small">
                    <Button
                        key={`delete-${record.id}`}
                        onClick={() => ModalPopup({
                            title: "Apakah anda ingin hapus mata pelajaran ini?",
                            onOk: () => {
                                deleteData(record.id);
                            },
                            content: "Klik Ok untuk hapus data",
                        }).showConfirm()
                        }
                        icon={<DeleteOutlined />}
                        danger
                    >
                    </Button>
                    <Button
                        key={`edit-${record.id}`}
                        onClick={() => handleEdit(record.id)}
                        icon={<EditOutlined />}
                    >
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
                    <h1 className="text-2xl font-semibold">Mata Pelajaran</h1>
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
                                placeholder="Cari mata pelajaran"
                                allowClear
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        fetchData(); // Fetch all data when search input is cleared
                                    }
                                }}
                                onSearch={(value) => searchMataPelajaran(value)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={mataPelajaranData}
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
                        title="Tambah Mata Pelajaran"
                        visible={isModalVisible}
                        onOk={handleSubmit}
                        onCancel={closeModal}
                        okText="Simpan"
                        cancelText="Batal"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="id"
                                label="ID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="nama"
                                label="Nama Mata Pelajaran"
                                rules={[{ required: true, message: 'Masukkan nama mata pelajaran' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Pilih status mata pelajaran' }]}
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

export default MataPelajaran;
