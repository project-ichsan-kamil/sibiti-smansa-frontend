import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input, Button, Space, Tabs, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, CheckCircleTwoTone, RocketOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Loading from "../../../components/template/Loading";
import CmsTemplate from '../../../components/template/CmsTemplate';
import ModalPopup from "../../../components/template/ConfirmModal";
import api from '../../../config/axios';
import { showErrorNotification, showSuccessNotification } from '../../../components/template/Notification';
import KuisDetailModal from "./KuisDetailModal"; // Import the modal component
import { BiBookAdd } from "react-icons/bi";
import MyEditor from "../../submit-soal/MyEditor";
import Utils from "../../../utils/Utils";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Kuis = () => {
    const [upcomingKuisData, setUpcomingKuisData] = useState([]);
    const [completeKuisData, setCompleteKuisData] = useState([]);
    const [filteredUpcomingData, setFilteredUpcomingData] = useState([]);
    const [filteredCompleteData, setFilteredCompleteData] = useState([]);
    const {showLoading, hideLoading, loading} = Utils()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedKuis, setSelectedKuis] = useState(null);

    const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
    const [upcomingPageSize, setUpcomingPageSize] = useState(10);
    const [completeCurrentPage, setCompleteCurrentPage] = useState(1);
    const [completePageSize, setCompletePageSize] = useState(10);

    const [activeTab, setActiveTab] = useState("1"); // Default tab is "1" (upcoming)

    useEffect(() => {
        getAllKuis();
    }, []);

    useEffect(() => {
        // Update filtered data based on search when activeTab changes
        if (activeTab === "1") {
            setFilteredUpcomingData(upcomingKuisData);
        } else if (activeTab === "2") {
            setFilteredCompleteData(completeKuisData);
        }
    }, [upcomingKuisData, completeKuisData, activeTab]);

    const getAllKuis = async () => {
        showLoading()
        try {
            const upcomingResponse = await api.get('/exam', {
                params: { statusExam: ['PUBLISH', 'DRAFT', 'WAITING_SUBMITTER', 'SHOW'], examType: "KUIS" }
            });

            const completeResponse = await api.get('/exam', {
                params: { statusExam: ['CLOSE'], examType: "KUIS" }
            });

            const upcomingKuis = upcomingResponse.data.data;
            const completeKuis = completeResponse.data.data;
            console.log(upcomingKuis);

            setUpcomingKuisData(upcomingKuis);
            setCompleteKuisData(completeKuis);
            setFilteredUpcomingData(upcomingKuis); // Set filtered data to all data initially
            setFilteredCompleteData(completeKuis); // Set filtered data to all data initially
        } catch (error) {
            showErrorNotification(error, "Gagal mengambil data kuis");
        } finally {
            hideLoading()
        }
    };

    const deleteKuis = async (id) => {
        showLoading()
        try {
            await api.delete(`/kuis/${id}`);
            showSuccessNotification("Kuis berhasil dihapus");
            getAllKuis();
        } catch (error) {
            showErrorNotification(error, "Gagal menghapus kuis");
        }finally{
            hideLoading()
        }
    };

    const showModal = (record) => {
        setSelectedKuis(record);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setSelectedKuis(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedKuis(null);
    };

    const convertToIndonesiaTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "WAITING_SUBMITTER":
                return "gold";
            case "PUBLISH":
                return "green";
            case "DRAFT":
                return "default";
            case "CLOSE":
                return "red";
            case "SHOW":
                return "blue";
            default:
                return "default";
        }
    };

    const searchKuis = (e) => {
        const searchText = e.target.value.toLowerCase();
        if (activeTab === "1") { // If active tab is "Upcoming"
            const filteredData = upcomingKuisData.filter(kuis =>
                kuis.name.toLowerCase().includes(searchText)
            );
            setFilteredUpcomingData(filteredData);
        } else if (activeTab === "2") { // If active tab is "Complete"
            const filteredData = completeKuisData.filter(kuis =>
                kuis.name.toLowerCase().includes(searchText)
            );
            setFilteredCompleteData(filteredData);
        }
    };

    const submitQuestions = async (recordId) => {
        showLoading()
        try {
          const response = await api.post('/questions/create', { examId: recordId });
          window.location.href =`/cms/submit-soal/${recordId}/1`
        } catch (error) {
          showErrorNotification(error, 'Gagal generate soal'); 
        }finally{
            hideLoading()
        }
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
                title: "Nama",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Mulai",
                dataIndex: "startDate",
                key: "startDate",
                render: (text) => convertToIndonesiaTime(text),
            },
            {
                title: "Durasi",
                dataIndex: "duration",
                key: "duration",
                render: (text) => `${text} Menit`,
            },
            {
                title: "KKM",
                dataIndex: "passingGrade",
                key: "passingGrade",
            },
            
            {
                title: "Soal",
                dataIndex: "sumQuestion",
                key: "sumQuestion",
                render: (text) => `${text} Soal`,
            },
           
            {
                title: "Acak Soal",
                dataIndex: "randomize",
                key: "randomize",
                render: (randomize) => (
                    randomize ? <Tag color="blue">Acak</Tag> :  <Tag color="red">Tidak</Tag>
                ),
            },
            {
                title: "Status",
                dataIndex: "statusExam",
                key: "statusExam",
                render: (status) => (
                    <Tag color={getStatusColor(status)}>
                        {status}
                    </Tag>
                ),
            },
            {
                title: "Progress",
                dataIndex: "progress",
                key: "progress",
                render: (progress) => {
                    const color = progress.isComplete ? 'green' : 'red';
                    return (
                        <Tag color={color}>
                            {progress.progress}
                        </Tag>
                    );
                },
            },
            {
                title: "Action",
                key: "action",
                align: 'center',
                render: (text, record) => (
                  <Space size="small">
                    <Tooltip title="Detail Kuis">
                      <Button
                        key={`info-${record.id}`}
                        onClick={() => showModal(record)}
                        icon={<InfoCircleOutlined />}
                        style={{ backgroundColor: '#1890ff', color: 'white' }} // Blue button for Info
                      />
                    </Tooltip>
                    <Tooltip title="Edit Kuis">
                      <Button
                        key={`edit-${record.id}`}
                        onClick={() => window.location.href = "/cms/kuis/edit/" + record.id}
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Hapus Kuis">
                      <Button
                        key={`delete-${record.id}`}
                        onClick={() => ModalPopup({
                          title: "Apakah anda ingin hapus kuis ini?",
                          onOk: () => deleteKuis(record.id),
                          content: "Klik Ok untuk hapus data",
                        }).showConfirm()}
                        danger
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Submit Soal">
                        <Button
                        key={`submit-${record.id}`}
                        onClick={() => submitQuestions(record.id)} // Panggil fungsi submitQuestions dengan ID kuis
                        icon={<BiBookAdd />}
                        style={{ backgroundColor: '#52c41a', color: 'white' }} // Custom color for submit action
                        />
                    </Tooltip>
                  </Space>
                ),
                width: "10%", // Adjust width as needed
              }
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
                            onChange={(value) => {
                                if (activeTab === "1") {
                                    setUpcomingPageSize(value);
                                } else {
                                    setCompletePageSize(value);
                                }
                            }}
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
                                onChange={searchKuis}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <Tabs
                        defaultActiveKey="1"
                        onChange={(key) => setActiveTab(key)} // Update activeTab on tab change
                    >
                        <TabPane tab={
                            <span>
                                <RocketOutlined className="mr-2" />
                                Upcoming
                            </span>
                        } key="1">
                            {renderTable(filteredUpcomingData, upcomingCurrentPage, upcomingPageSize, setUpcomingCurrentPage, setUpcomingPageSize)}
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <CheckCircleTwoTone className="mr-2" twoToneColor="#52c41a" />
                                    Complete
                                </span>
                            } key="2">
                            {renderTable(filteredCompleteData, completeCurrentPage, completePageSize, setCompleteCurrentPage, setCompletePageSize)}
                        </TabPane>
                    </Tabs>
                </div>
            </CmsTemplate>

            {loading && <Loading />}

            {/* Modal for detailed view */}
            <KuisDetailModal
                visible={isModalVisible}
                onClose={handleOk}
                kuis={selectedKuis}
            />
        </Fragment>
    );
};

export default Kuis;
