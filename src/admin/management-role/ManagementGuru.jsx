import React, { useState, useEffect, Fragment } from "react";
import {
    Table,
    Select,
    Input,
    Button,
    Space,
    Modal,
    Form,
    notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import ModalPopup from "../../components/ConfirmModal";
import axios from "axios";
import Utils from "../../utils/Utils";
import api from "../../config/axios";

const { Option } = Select;
const { Search } = Input;

const ManagementGuru = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const { showLoading, hideLoading, loading, localUrl, getHeaders } = Utils();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetchData();
        fetchUsers();
        fetchSubjects();
    }, []);

    const fetchData = async (name = "") => {
        showLoading();
        try {
            const response = await api.get(`/user-roles/list-guru?name=${name}`);
            console.log(response.data.data);
            setUserData(response.data.data);
        } catch (e) {
            console.log(e);
            notification.error({
                message: "Error",
                description: e.response?.data?.message || "Failed to fetch data.",
            });
        } finally {
            hideLoading();
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/users/unassigned-verified-users`);
            setUsers(response.data.data);
        } catch (e) {
            console.log(e);
            notification.error({
                message: "Error",
                description: e.response?.data?.message || "Failed to fetch users.",
            });
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await api.get(`/subjects`);
            setSubjects(response.data.data);
        } catch (e) {
            console.log(e);
            notification.error({
                message: "Error",
                description: e.response?.data?.message || "Failed to fetch subjects.",
            });
        }
    };

    const deleteData = async (roleId) => {
        showLoading();
        try {
            const response = await api.delete(`/user-roles/guru`, {
                params: { roleId },
            });
            notification.success({
                message: "Success",
                description: response.data.message || "User deleted successfully.",
            });
            fetchData();
        } catch (e) {
            console.log(e);
            notification.error({
                message: "Error",
                description: e.response?.data?.message || "Failed to delete user.",
            });
        } finally {
            hideLoading();
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

    const handleSubmit = async () => {
        const values = await form.validateFields();
        if (values.userId && values.subjectId && values.role) {
            try {
                showLoading();
                
                const response = await api.post(`/user-roles/create`, {
                    userId: Number(values.userId),
                    subjectId: Number(values.subjectId),
                    role: values.role
                });
    
                notification.success({
                    message: "Success",
                    description: response.data.message || "User role assigned successfully.",
                });
    
                fetchData();
                closeModal();
            } catch (e) {
                console.log(e);
                notification.error({
                    message: "Error",
                    description: e.response?.data?.message || "Failed to assign user role.",
                });
            } finally {
                hideLoading();
            }
        }
    };
    
    const searchUser = (value) => {
        fetchData(value);
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
                            ModalPopup({
                                title: "Apakah anda ingin hapus pengguna ini?",
                                onOk: () => deleteData(record.id),
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
                                onSearch={(value) => searchUser(value)}
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
                        onOk={handleSubmit}
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
