import React, { useState, useEffect, Fragment } from "react";
import {
    Table,
    Select,
    Input,
    Button,
    Space,
    Form,
    notification,
    Modal,
    Upload,
} from "antd";
import {
    DeleteOutlined,
    CheckOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    DownloadOutlined,
    UploadOutlined,
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [classOptions, setClassOptions] = useState([]);

    useEffect(() => {
        fetchData();
        fetchClassOptions();
    }, []);

    const fetchData = async (searchQuery = "") => {
        showLoading();
        try {
            let response;
            if (searchQuery) {
                response = await api.get(`/users/search`, {
                    params: { fullName: searchQuery, isVerified: true },
                });
            } else {
                response = await api.get(`users/user-unverified`);
            }

            const dataWithKeys = response.data.data.map((item, index) => ({
                ...item,
                key: item.id || index,
            }));
            setUserData(dataWithKeys);
        } catch (e) {
            notification.error({
                message: "Error",
                description:
                    e.response?.data?.message || "Failed to fetch data",
            });
        } finally {
            hideLoading();
        }
    };

    const fetchClassOptions = async () => {
        try {
            const response = await api.get("/classes");
            setClassOptions(response.data.data);
        } catch (e) {
            notification.error({
                message: "Error",
                description: "Failed to fetch class options.",
            });
        }
    };

    const deleteData = async (id) => {
        showLoading();
        try {
            const response = await api.delete(`/users/delete`, {
                params: { userId: id },
            });
            fetchData();
            notification.success({
                message: "Deleted Successfully",
                description:
                    response.data.message ||
                    "The user has been successfully deleted.",
            });
        } catch (e) {
            notification.error({
                message: "Deletion Failed",
                description:
                    e.response?.data?.message ||
                    "Failed to delete the user. Please try again or contact support.",
            });
        } finally {
            hideLoading();
        }
    };

    const handleApprove = async (userIds = null) => {
        showLoading();
        try {
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

    const handleFormSubmit = async (values) => {
        try {
            showLoading();
            const response = await api.post("/users/create", values);
            notification.success({
                message: "User Created Successfully",
                description: response.data.message,
            });
            fetchData();
        } catch (e) {
            notification.error({
                message: "Creation Failed",
                description:
                    e.response?.data?.message ||
                    "An unexpected error occurred during user creation. Please try again.",
            });
        } finally {
            hideLoading();
        }
    };

    const handleSave = async () => {
        setIsConfirmModalVisible(true);
    };

    const handleConfirmSave = () => {
        form.validateFields().then((values) => {
            handleFormSubmit(values);
            setIsConfirmModalVisible(false);
            setIsModalVisible(false);
        });
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handleDownloadTemplate = async () => {
        showLoading();
        try {
            const response = await api.get(
                "/excel/generate-template-create-user",
                {
                    responseType: "blob", // Set response type to blob for file download
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Users_Template.xlsx"); // Define file name
            document.body.appendChild(link);
            link.click();
        } catch (e) {
            notification.error({
                message: "Download Failed",
                description:
                    e.response?.data?.message || "Failed to download template.",
            });
        } finally {
            hideLoading();
        }
    };

    const handleUploadTemplate = async (options) => {
        const { file } = options;

        if (!file) {
            console.error("No file found in upload request");
            notification.error({
                message: "No File Provided",
                description: "Please select a file to upload.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        showLoading();
        try {
            const response = await api.post("/users/upload-excel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            notification.success({
                message: "Upload Successful",
                description: response.data.message,
            });
            fetchData(); // Refresh user data after successful upload
        } catch (e) {
            console.error("Upload error:", e);
            notification.error({
                message: "Upload Failed",
                description:
                    e.response?.data?.message ||
                    "Failed to upload template. Please try again.",
            });
        } finally {
            hideLoading();
            fetchData(); 
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const columns = [
        {
            title: "No",
            dataIndex: "id",
            key: "id",
            width: "3%",
            align: "center",
            render: (text, record, index) =>
                index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Full Name",
            dataIndex: ["profile", "fullName"],
            key: "fullName",
            width: "20%",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "20%",
        },
        {
            title: "Password",
            dataIndex: ["profile", "encrypt"],
            key: "password",
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
            title: "Phone Number",
            dataIndex: ["profile", "noHp"],
            key: "noHp",
            width: "15%",
        },
        {
            title: "Class",
            dataIndex: ["class", "name"],
            key: "class",
            width: "15%",
            render: (text) => (text ? text : "-"),
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
                                title: "Are you sure you want to delete this user?",
                                onOk: () => deleteData(record.id),
                                content: "Click OK to confirm user deletion.",
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
                        onClick={() => handleApprove(record.id)}
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
                    <h1 className="text-2xl font-semibold">Add User</h1>
                    <div className="flex w-full justify-between mt-6 mb-4">
                        <div className="space-x-2">
                            <Select
                                defaultValue="10"
                                style={{ width: 80 }}
                                onChange={setPageSize}
                            >
                                <Option value="10">10</Option>
                                <Option value="25">25</Option>
                                <Option value="50">50</Option>
                            </Select>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadTemplate}
                            >
                                Download
                            </Button>
                            <Upload
                                name="file"
                                accept=".xlsx"
                                showUploadList={false}
                                customRequest={handleUploadTemplate}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload
                                </Button>
                            </Upload>
                        </div>

                        <div className="space-x-2">
                            <Button
                                style={{
                                    backgroundColor: "#4CAF50",
                                    borderColor: "#4CAF50",
                                    color: "white",
                                }}
                                onClick={() => handleApprove()}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Approve
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    form.resetFields();
                                    setIsModalVisible(true);
                                }}
                            >
                                Add
                            </Button>
                            <Search
                                placeholder="Search User"
                                allowClear
                                onSearch={(value) => fetchData(value)}
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        fetchData();
                                    }
                                }}
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

                    {/* Add User Modal */}
                    <Modal
                        title="Add New User"
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        onOk={handleSave}
                        okText="Save"
                        cancelText="Cancel"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter full name",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter email",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter password",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="noHp"
                                label="Phone Number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter phone number",
                                    },
                                    {
                                        pattern: /^[0-9]+$/,
                                        message:
                                            "Phone number must contain only digits",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="class" label="Class">
                                <Select placeholder="Select Class">
                                    {classOptions.map((classItem) => (
                                        <Option
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
                                            {classItem.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Confirmation Modal */}
                    <Modal
                        title="Confirm Save"
                        visible={isConfirmModalVisible}
                        onOk={handleConfirmSave}
                        onCancel={() => setIsConfirmModalVisible(false)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <p>Are you sure you want to save this user?</p>
                    </Modal>
                </div>
            </CmsTemplate>
            {loading && <Loading />}
        </Fragment>
    );
};

export default CreateUser;
