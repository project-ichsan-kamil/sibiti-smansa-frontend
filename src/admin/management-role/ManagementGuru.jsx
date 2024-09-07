import React, { useState, useEffect, Fragment } from "react";
import {
    Table,
    Select,
    Input,
    Button,
    Space,
    Modal,
    Form,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import ConfirmModal from "../../components/template/ConfirmModal";
import Utils from "../../utils/Utils";
import api from "../../config/axios";
import { showErrorNotification, showSuccessNotification } from "../../components/template/Notification";
import { ADMIN_API, GURU_API } from "../../config/ApiConstants";

const { Option } = Select;
const { Search } = Input;

const useFetchData = (setUserData, showLoading, hideLoading) => {
    const fetchData = async (name = "") => {
        showLoading();
        try {
            const response = await api.get(GURU_API.getListGuru, {
                params: { name: name },
            });
            setUserData(response.data.data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data guru.");
        } finally {
            hideLoading();
        }
    };
    

    return { fetchData };
};

const useFetchOptions = (setUsers, setSubjects) => {
    const fetchUsers = async () => {
        try {
            const response = await api.get(GURU_API.getListUnAssignUser);
            setUsers(response.data.data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data user");
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await api.get(GURU_API.getSubject);
            setSubjects(response.data.data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data mata pelajaran");
        }
    };

    return { fetchUsers, fetchSubjects };
};

const ManagementGuru = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const { fetchData } = useFetchData(setUserData, showLoading, hideLoading);
    const { fetchUsers, fetchSubjects } = useFetchOptions(setUsers, setSubjects);

    useEffect(() => {
        fetchData();
        fetchUsers();
        fetchSubjects();
    }, []);

    const handleDelete = async (roleId) => {
        showLoading();
        try {
            const response = await api.delete(GURU_API.deleteGuru, {
                params: { roleId },
            });
            showSuccessNotification("Success", response.data.message || "Guru berhasil dihapus");
            fetchData();
        } catch (e) {
            showErrorNotification(e, "Gagal menghapus guru");
        } finally {
            hideLoading();
        }
    };

    const handleModalSubmit = async () => {
        const values = await form.validateFields();
        if (values.userId && values.subjectId && values.role) {
            try {
                showLoading();
                const response = await api.post(GURU_API.createGuru, {
                    userId: Number(values.userId),
                    subjectId: Number(values.subjectId),
                    role: values.role,
                });
                showSuccessNotification("Success", response.data.message || "User role guru berhasil ditambahkan");
                fetchData();
                closeModal();
            } catch (e) {
                showErrorNotification(e, "Gagal menambahkan role guru");
            } finally {
                hideLoading();
            }
        }
    };

    const showModal = () => {
        form.setFieldsValue({ role: "GURU" });
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: "No",
            dataIndex: "id",
            width: "3%",
            align: "center",
            render: (text, record, index) =>
                index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Nama",
            dataIndex: "fullName",
            width: "20%",
        },
        {
            title: "Mata Pelajaran",
            dataIndex: "subject",
            width: "20%",
        },
        {
            title: "Action",
            align: "center",
            render: (text, record) => (
                <Space size="small">
                    <Button
                        key={`delete-${record.id}`}
                        onClick={() =>
                            ConfirmModal({
                                title: "Apakah anda ingin hapus data ini?",
                                onOk: () => handleDelete(record.id),
                                content: "Klik Ok untuk hapus data",
                            }).showConfirm()
                        }
                        icon={<DeleteOutlined />}
                        danger
                    />
                </Space>
            ),
            width: "20%",
        },
    ];

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">Management Guru</h1>
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
                            <Button type="primary" onClick={showModal}>
                                Tambah Guru
                            </Button>
                            <Search
                                placeholder="Cari Guru"
                                allowClear
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        fetchData();
                                    }
                                }}
                                onSearch={fetchData}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={userData}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            onChange: (page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            },
                            showSizeChanger: false,
                            position: ["bottomCenter"],
                        }}
                        size="small"
                    />

                    <Modal
                        title={"Tambah Guru"}
                        visible={isModalVisible}
                        onOk={handleModalSubmit}
                        onCancel={closeModal}
                        okText="Simpan"
                        cancelText="Batal"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="userId"
                                label="User"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilih user",
                                    },
                                ]}
                            >
                                <Select placeholder="Pilih user">
                                    {users.map((user) => (
                                        <Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Role"
                                initialValue="GURU"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilih role",
                                    },
                                ]}
                            >
                                <Select disabled>
                                    <Option value="GURU">Guru</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="subjectId"
                                label="Mata Pelajaran"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilih mata pelajaran",
                                    },
                                ]}
                            >
                                <Select placeholder="Pilih mata pelajaran">
                                    {subjects.map((subject) => (
                                        <Option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </Option>
                                    ))}
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

export default ManagementGuru;
