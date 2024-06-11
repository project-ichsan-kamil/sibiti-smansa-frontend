import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input, Button, Space, Form, Tabs, Tag } from "antd";
import { DeleteOutlined, EditOutlined, CheckCircleTwoTone, RocketOutlined } from '@ant-design/icons';
import Loading from "../../../components/Loading"
import CmsTemplate from '../../../components/CmsTemplate';
import ModalPopup from "../../../components/ConfirmModal";
import KuisHooks from "./hooks/KuisHooks";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Kuis = () => {
    // form data
    const [form] = Form.useForm();
    
    const {getAllKuis,convertToIndonesiaTime, deleteKuis, upcomingKuisData, loading} = KuisHooks()
    const [completeKuisData, setCompleteKuisData] = useState([]);

    // pagination
    const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
    const [upcomingPageSize, setUpcomingPageSize] = useState(10);
    const [completeCurrentPage, setCompleteCurrentPage] = useState(1);
    const [completePageSize, setCompletePageSize] = useState(10);

    useEffect(() => {
        getAllKuis()
    }, []);

    const handleEdit = (id) => {
        // logic to handle edit
    };

    const searchKuis = (e) => {
        // logic to search kuis
    };

    const renderTable = (data, currentPage, pageSize, setCurrentPage, setPageSize) => {
        const columns = [
            {
                title: "No",
                align: 'center',
                dataIndex: "id",
                key: "id",
                width: "3%",
                render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: "Judul",
                align: 'center',
                dataIndex: "nama",
                key: "nama",
                width: "17%",
            },
            {
                title: "Mulai",
                align: 'center',
                dataIndex: "mulai",
                key: "mulai",
                width: "10%",
                render: (text) => convertToIndonesiaTime(text), 
            },
            {
                title: "Selesai",
                align: 'center',
                dataIndex: "selesai",
                key: "selesai",
                width: "10%",
                render: (text) => convertToIndonesiaTime(text), 
            },
            {
                title: "Durasi",
                align: 'center',
                dataIndex: "durasi",
                key: "durasi",
                render: (text) => `${text} Menit`,
                width: "10%",
            },
            {
                title: "Peserta",
                align: 'center',
                dataIndex: "peserta",
                key: "peserta",
                width: "15%",
                render: (peserta) => (
                    <div>
                      {peserta.map((item, index) => (
                        <Tag color="default" key={index}>
                          {item}
                        </Tag>
                      ))}
                    </div>
                  ),
            },
            {
                title: "Status",        //TODO statusnya ditambah waiting soal
                dataIndex: "statusUjian",
                key: "status",
                width: "8%",
                align: 'center',
                render: (status) => (
                    <p style={{ color: status === 1 ? 'blue' : 'red' }}>
                        {status == 1 ? "Publish" : "Draft"}
                    </p>
                )
            },
            {
                title: "Action",
                key: "action",
                align: 'center',
                render: (text, record) => (
                    <Space size="small">
                        <Button
                            key={`delete-${record.id}`}
                            onClick={() => ModalPopup({
                                title: "Apakah anda ingin hapus kuis ini?",
                                onOk: () => {
                                    deleteKuis(record.id);
                                },
                                content: "Klik Ok untuk hapus data",
                            }).showConfirm()}
                            danger
                            icon={<DeleteOutlined />}
                        />
                        <Button
                            key={`edit-${record.id}`}
                            onClick={() => window.location.href = "/cms/kuis/edit/" + record.id}
                            icon={<EditOutlined />}
                        />
                    </Space>
                ),
                width: "10%",
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    showSizeChanger: false,
                    position: ["bottomCenter"]
                }}
                size="small"
            />
        );
    };

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">Kuis</h1>
                    <div className="flex w-full justify-between mt-6 mb-4">
                        <Select
                            defaultValue="10"
                            style={{ width: 80 }}
                            onChange={(value) => setUpcomingPageSize(value)}
                        >
                            <Option value="10">10</Option>
                            <Option value="25">25</Option>
                            <Option value="50">50</Option>
                        </Select>

                        <div className="space-x-2">
                            <Button type="primary" onClick={() => { window.location.href = "/cms/kuis/add" }}>Tambah</Button>
                            <Search
                                placeholder="Cari kuis"
                                allowClear
                                onChange={(e) => searchKuis(e)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab={
                            <span>
                                <RocketOutlined className="mr-2" />
                                Upcoming
                            </span>
                        } key="1">
                            {renderTable(upcomingKuisData, upcomingCurrentPage, upcomingPageSize, setUpcomingCurrentPage, setUpcomingPageSize)}
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <CheckCircleTwoTone className="mr-2" twoToneColor="#52c41a" />
                                    Complete
                                </span>
                            } key="2">
                            {renderTable(completeKuisData, completeCurrentPage, completePageSize, setCompleteCurrentPage, setCompletePageSize)}
                        </TabPane>
                    </Tabs>

                </div>
            </CmsTemplate>

            {loading && <Loading/>}
        </Fragment>
    );
};

export default Kuis;




