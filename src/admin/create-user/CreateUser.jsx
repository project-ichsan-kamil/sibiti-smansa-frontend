import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input, Button, Space, Modal, Form, notification } from "antd";
import { DeleteOutlined, EditOutlined, CheckOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import CmsTemplate from '../../components/CmsTemplate';
import Loading from "../../components/Loading";
import ModalPopup from "../../components/ConfirmModal";
import axios from 'axios';
import Utils from "../../utils/Utils";

const { Option } = Select;
const { Search } = Input;

const CreateUser = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const { showLoading, hideLoading, loading, localUrl, getHeaders } = Utils();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        showLoading();
        axios.get(`${localUrl}/api/users/user-unverified`, getHeaders())
        .then(response => {
            const data = response.data.data;
            setUserData(data);
        })
        .catch(e => {
            console.log(e);
            const error = e.response.data;
            notification.error({message : error.message});
        })
        .finally(() => {
            hideLoading();
        });
    };

    const deleteData = (id) => {
        showLoading();
        axios.delete(`${localUrl}/api/users/delete/${id}`, getHeaders())
        .then(response => {
            fetchData();
            const res = response.data;
            notification.success({ message: res.message });
        })
        .catch(e => {
            console.log(e);
            const error = e.response.data;
            notification.error({message : error.message});
        })
        .finally(() => {
            hideLoading();
        });
    };

    const handleEdit = (id) => {
        showLoading();
        axios.get(`${localUrl}/api/users/get-user/${id}`, getHeaders())
        .then(response => {
            const user = response.data.data;
            form.setFieldsValue({
                id: user.id,
                username: user.username,
                password: user.profile.encrypt,
                fullName: user.profile.fullName,
                email: user.profile.email,
                noHp: user.profile.noHp
            });
            setEditMode(true);
            setIsModalVisible(true);
        })
        .catch(e => {
            console.log(e);
            const error = e.response.data;
            notification.error({message : error.message});
        })
        .finally(() => {
            hideLoading();
        });
    };

    const handleApprove = (id) => {
        const token = localStorage.getItem('token');

        showLoading();
        axios.put(`${localUrl}/api/users/approve/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            fetchData();
            notification.success({ message: 'User approved successfully' });
        })
        .catch(error => {
            console.error('There was an error approving the user!', error);
        })
        .finally(() => {
            hideLoading();
        });
    };

    const searchUser = (value) => {
        if (!value) {
            fetchData();
        } else {
            showLoading();
            axios.get(`${localUrl}/api/users/search/${value}`, getHeaders())
            .then(response => {
                const data = response.data.data;
                setUserData(data);
            })
            .catch(e => {
                console.log(e);
                const error = e.response.data;
                notification.error({message : error.message});
            })
            .finally(() => {
                hideLoading();
            });
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditMode(false);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            showLoading();
            if (editMode) {
                axios.patch(`${localUrl}/api/users/profile-update/${values.id}`, values, getHeaders())
                .then(response => {
                    fetchData();
                    const res = response.data;
                    notification.success({ message: res.message });
                })
                .catch(e => {
                    console.log(e);
                    const error = e.response.data;
                    notification.error({message: error.message});
                })
                .finally(() => {
                    hideLoading();
                    closeModal();
                })
            } else {
                axios.post(`${localUrl}/api/users/create`, values, getHeaders())
                .then(response => {
                    fetchData();
                    const res = response.data;
                    notification.success({ message: res.message });
                })
                .catch(e => {
                    console.log(e);
                    const error = e.response.data;
                    notification.error({message: error.message});
                })
                .finally(() => {
                    hideLoading();
                    closeModal();
                });
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

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
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: "20%",
        },
        {
            title: "Nama Lengkap",
            dataIndex: ["profile", "fullName"],
            key: "fullName",
            width: "20%",
        },   
        {
            title: "Password",
            dataIndex: ["profile", "encrypt"],
            key: "encrypt",
            width: "20%",
            render: (text, record) => (
                <Space className="flex justify-between">
                    <span>{passwordVisible[record.id] ? record.profile.encrypt : '●●●●●●●●●●●●●●●●●●●●●●●●'}</span>
                    <Button
                        type="link"
                        icon={passwordVisible[record.id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => togglePasswordVisibility(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: ["profile", "email"],
            key: "email",
            width: "20%",
        },
        {
            title: "No HP",
            dataIndex: ["profile", "noHp"],
            key: "noHp",
            width: "15%",
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
                            title: "Apakah anda ingin hapus pengguna ini?",
                            onOk: () => {
                                deleteData(record.id);
                            },
                            content: "Klik Ok untuk hapus data",
                        }).showConfirm()}
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
                    <Button
                        key={`approve-${record.id}`}
                        onClick={() => handleApprove(record.id)}
                        icon={<CheckOutlined />}
                        type="primary"
                    >
                    </Button>
                </Space>
            ),
            width: "20%",
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
                            onChange={(value) => setPageSize(value)}
                        >
                            <Option value="10">10</Option>
                            <Option value="25">25</Option>
                            <Option value="50">50</Option>
                        </Select>

                        <div className="space-x-2">
                            <Button type="primary" onClick={showModal}>Tambah</Button>
                            <Search
                                placeholder="Cari pengguna"
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
                            showSizeChanger: false, position: ["bottomCenter"]
                        }}
                        size="small"
                    />

                    <Modal
                        title={editMode ? "Edit Pengguna" : "Tambah Pengguna"}
                        visible={isModalVisible}
                        onOk={handleSubmit}
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
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: 'Masukkan username' }]}
                            >
                                <Input disabled={editMode} />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Masukkan password' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="fullName"
                                label="Nama Lengkap"
                                rules={[{ required: true, message: 'Masukkan Nama Lengkap' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Masukkan email' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="noHp"
                                label="No HP"
                                rules={[{ required: true, message: 'Masukkan no hp pengguna' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </CmsTemplate>

            {loading && <Loading />}
        </Fragment>
    );
};

export default CreateUser;


