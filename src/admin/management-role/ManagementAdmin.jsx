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
import { showSuccessNotification, showErrorNotification } from "../../components/template/Notification";
import { ADMIN_API } from "../../config/ApiConstants";

const { Option } = Select;
const { Search } = Input;

const ManagementAdmin = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const { showLoading, hideLoading, loading, localUrl } = Utils();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAdminData();
        fetchUsers();
    }, []);

    const fetchAdminData = async (name = "") => {
        showLoading();
        try {
            const response = await api.get(ADMIN_API.fetchAdmin, {
                params: { name: name },
            });
            const data = response.data.data;
            setUserData(data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data admin");
        } finally {
            hideLoading();
        }
    };
    

    const fetchUsers = async () => {
        try {
            const response = await api.get(ADMIN_API.getListGuru);
            setUsers(response.data.data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data guru");
        }
    };

    const deleteData = async (id) => {
        showLoading();
        try {
            const response = await api.delete(ADMIN_API.deleteAdmin, {
                params: {
                    roleId : id
                }
            });
            fetchAdminData();
            showSuccessNotification("Success", response.data.message || "Admin berhasil dihapus" );
        } catch (e) {
            showErrorNotification(e, "Gagal menghapus user");
        } finally {
            hideLoading();
        }
    };

    const showModal = () => {
        form.setFieldsValue({ role: "ADMIN" }); // Set default role to admin
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (values.userId && values.role) {
            try {
                showLoading();
                const response = await api.post(ADMIN_API.createAdmin, {
                    userId: Number(values.userId),
                    role: values.role
                });
                fetchAdminData();
                showSuccessNotification("Success", response.data.message || "Role admin berhasil ditambahkan");
                closeModal();
            } catch (e) {
                showErrorNotification(e, "Gagal menambahkan role user");
            } finally {
                hideLoading();
            }
        } 
    };
    
    const searchUser = (value) => {
        fetchAdminData(value);
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
            title: "Name",
            dataIndex: "fullName",
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
                                onOk: () => deleteData(record.id),
                                content: "Klik Ok untuk hapus data.",
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
                    <h1 className="text-2xl font-semibold">Management Admin</h1>
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
                                Tambah Admin
                            </Button>
                            <Search
                                placeholder="Cari Admin"
                                allowClear
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        fetchAdminData();
                                    }
                                }}
                                onSearch={searchUser}
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
                        title={"Tambah Admin"}
                        visible={isModalVisible}
                        onOk={handleSubmit}
                        onCancel={closeModal}
                        okText="Save"
                        cancelText="Cancel"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="userId"
                                label="User"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a user",
                                    },
                                ]}
                            >
                                <Select placeholder="Select user">
                                    {users.map((user) => (
                                        <Option key={user.userId} value={user.userId}>
                                            {user.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Role"
                                initialValue="admin"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a role",
                                    },
                                ]}
                            >
                                <Select disabled>
                                    <Option value="admin">Admin</Option>
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

export default ManagementAdmin;
