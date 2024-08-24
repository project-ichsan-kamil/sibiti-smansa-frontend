import React, { useState, useEffect, Fragment } from "react";
import {
    Table,
    Select,
    Input,
    Button,
    Space,
    Form,
    notification,
} from "antd";
import {
    DeleteOutlined,
    CheckOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import ModalPopup from "../../components/ConfirmModal";
import Utils from "../../utils/Utils";
import api from "../../config/axios";

const { Option } = Select;
const { Search } = Input;

const CreateUser = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State for selected row keys

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        showLoading();
        try {
            const response = await api.get(`users/user-unverified`);
            const dataWithKeys = response.data.data.map((item, index) => ({
                ...item,
                key: item.id || index, // Ensure each item has a unique key
            }));
            setUserData(dataWithKeys);
        } catch (e) {
            notification.error({
                message: e.response?.data?.message || "Failed to fetch data",
            });
        } finally {
            hideLoading();
        }
    };

    const deleteData = async (id) => {
        showLoading();
        try {
            const response = await api.delete(`/users/delete/${id}`);
            fetchData();
            notification.success({ message: response.data.message });
        } catch (e) {
            notification.error({
                message: e.response?.data?.message || "Failed to delete user",
            });
        } finally {
            hideLoading();
        }
    };

    const handleApprove = async (userIds = null) => {
        showLoading();
        try {
            // Use passed userIds if present, otherwise use selectedRowKeys for bulk approval
            const idsToApprove = userIds ? [userIds] : selectedRowKeys;

            if (idsToApprove.length === 0) {
                notification.warning({
                    message: "No users selected",
                    description: "Please select at least one user to approve.",
                });
                return;
            }

            const userIdsString = idsToApprove.join(",");
            const response = await api.post(
                `/users/verify`,
                {},
                {
                    params: { userIds: userIdsString },
                }
            );
            fetchData();
            notification.success({
                message: "Approval Successful",
                description: response.data.message,
            });
        } catch (e) {
            notification.error({
                message: "Approval Failed",
                description:
                    e.response?.data?.message ||
                    "An unexpected error occurred during the approval process. Please try again.",
            });
        } finally {
            hideLoading();
        }
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys); // Update selected row keys correctly
        },
    };

    const columns = [
        {
            title: "No",
            dataIndex: "id",
            key: "id", // Ensure this matches your data
            width: "3%",
            align: "center",
            render: (text, record, index) =>
                index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Nama Lengkap",
            dataIndex: ["profile", "fullName"],
            key: "fullName", // Ensure this matches your data
            width: "20%",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email", // Ensure this matches your data
            width: "20%",
        },
        {
            title: "Password",
            dataIndex: ["profile", "encrypt"],
            key: "password", // Ensure this matches your data
            width: "20%",
            render: (text, record) => (
                <Space className="flex justify-between">
                    <span>
                        {passwordVisible[record.id]
                            ? record.profile.encrypt
                            : "●●●●●●●●●●●●●●●●●●●●●●●●"}
                    </span>
                    <Button
                        type="link"
                        icon={
                            passwordVisible[record.id] ? (
                                <EyeInvisibleOutlined />
                            ) : (
                                <EyeOutlined />
                            )
                        }
                        onClick={() => togglePasswordVisibility(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: "No HP",
            dataIndex: ["profile", "noHp"],
            key: "noHp", // Ensure this matches your data
            width: "15%",
        },
        {
            title: "Action",
            align: "center",
            width: "20%",
            render: (text, record) => (
                <Space size="small">
                    <Button
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
                    <Button
                        style={{
                            backgroundColor: "#4CAF50",
                            borderColor: "#4CAF50",
                            color: "white",
                        }}
                        onClick={() => handleApprove(record.id)} // Approving an individual user
                        icon={<CheckOutlined />}
                        type="primary"
                    />
                </Space>
            ),
        },
    ];

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">Tambah User</h1>
                    <div className="flex w-full justify-between mt-6 mb-4">
                        <Select
                            defaultValue="10"
                            style={{ width: 80 }}
                            onChange={setPageSize}
                        >
                            <Option value="10">10</Option>
                            <Option value="25">25</Option>
                            <Option value="50">50</Option>
                        </Select>
                        <div className="space-x-2">
                            <Button
                                style={{
                                    backgroundColor: "#4CAF50",
                                    borderColor: "#4CAF50",
                                    color: "white",
                                }}
                                onClick={() => handleApprove()} // Bulk approval
                                disabled={selectedRowKeys.length === 0}
                            >
                                Approve
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => setIsModalVisible(true)}
                            >
                                Tambah
                            </Button>
                            <Search
                                placeholder="Cari User"
                                allowClear
                                onSearch={fetchData}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={userData}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            onChange: (page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            },
                            showSizeChanger: false,
                            position: ["bottomCenter"],
                        }}
                        size="small"
                    />
                </div>
            </CmsTemplate>
            {loading && <Loading />}
        </Fragment>
    );
};

export default CreateUser;

