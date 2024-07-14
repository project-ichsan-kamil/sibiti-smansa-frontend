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
import {
    DeleteOutlined,
} from "@ant-design/icons";
import CmsTemplate from "../../components/CmsTemplate";
import Loading from "../../components/Loading";
import ModalPopup from "../../components/ConfirmModal";
import axios from "axios";
import Utils from "../../utils/Utils";

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

    const fetchData = (role = "guru", name = "") => {
        showLoading();
        axios
            .get(`${localUrl}/api/user-role/search?role=${role}&name=${name}`, getHeaders())
            .then((response) => {
                const data = response.data.data;
                console.log(data);
                setUserData(data);
            })
            .catch((e) => {
                console.log(e);
                const error = e.response.data;
                notification.error({ message: error.message });
            })
            .finally(() => {
                hideLoading();
            });
    };

    const fetchUsers = () => {
        axios
            .get(`${localUrl}/api/users/user-verified`, getHeaders())
            .then((response) => {
                setUsers(response.data.data);
            })
            .catch((e) => {
                console.log(e);
                const error = e.response.data;
                notification.error({ message: error.message });
            });
    };

    const fetchSubjects = () => {
        axios
            .get(`${localUrl}/api/subjects`, getHeaders())
            .then((response) => {
                console.log(response.data.data);
                setSubjects(response.data.data);
            })
            .catch((e) => {
                console.log(e);
                const error = e.response.data;
                notification.error({ message: error.message });
            });
    };

    const deleteData = (id) => {
        console.log(id);
        showLoading();
        axios
            .delete(`${localUrl}/api/user-role/${id}`, getHeaders())
            .then((response) => {
                fetchData();
                const res = response.data;
                notification.success({ message: res.message });
            })
            .catch((e) => {
                console.log(e);
                const error = e.response.data;
                notification.error({ message: error.message });
            })
            .finally(() => {
                hideLoading();
            });
    };

    const showModal = () => {
        form.setFieldsValue({ role: 'guru' }); // Set default role to guru
        setIsModalVisible(true);
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
                axios
                    .post(`${localUrl}/api/user-role`, values, getHeaders())
                    .then((response) => {
                        fetchData();
                        const res = response.data;
                        notification.success({ message: res.message });
                    })
                    .catch((e) => {
                        console.log(e);
                        const error = e.response.data;
                        notification.error({ message: error.message });
                    })
                    .finally(() => {
                        hideLoading();
                        closeModal();
                    });
            
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const searchUser = (value) => {
        fetchData("guru", value);
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
            dataIndex: "fullname",
            width: "20%",
        },
        {
            title: "Mata Pelajaran",
            dataIndex: "subjectName",
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
                                onOk: () => {
                                    deleteData(record.id);
                                },
                                content: "Klik Ok untuk hapus data",
                            }).showConfirm()
                        }
                        icon={<DeleteOutlined />}
                        danger
                    ></Button>
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
                                placeholder="Cari user"
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
                                            {user.profile.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Role"
                                initialValue="guru"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilih role",
                                    },
                                ]}
                            >
                                <Select disabled>
                                    <Option value="guru">Guru</Option>
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
