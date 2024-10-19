import React, { useState, useEffect, Fragment } from "react";
import { Table, Input, Tag, Select, Button, Modal, DatePicker } from "antd";
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import Loading from "../../components/template/Loading";
import Utils from "../../utils/Utils";
import { showErrorNotification } from "../../components/template/Notification";
import useModalDownload from "./hooks/useModalDownload";
import CmsTemplate from '../../components/template/CmsTemplate';
import moment from 'moment';
import api from "../../config/axios";

const { Search } = Input;
const { Option } = Select;

const AbsensiGuruTable = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
    const [lastFetchedTime, setLastFetchedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.log("Initial fetch of attendance data");
        // Initial fetch of attendance data
        fetchAttendanceData();
        // Set interval to refetch data every 5 minutes
        const interval = setInterval(() => {
            const currentMinute = moment().minute();
            console.log(`Current minute: ${currentMinute}`);
            if (currentMinute % 5 === 0) {
                console.log("Fetching attendance data on 5-minute interval");
                fetchAttendanceData();
            }
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const fetchAttendanceData = async (date) => {
        console.log("Fetching attendance data...");
        showLoading();

        // Gunakan selectedDate atau fallback ke parameter date yang dikirim
        const dateParam = date || selectedDate;

        try {
            const response = await api.get('/absents/by-date', {
                params: {
                    date: dateParam,  // Mengirim parameter tanggal yang dipilih, pastikan ada nilainya
                },
            });

            const data = response.data.data; // Sesuaikan dengan struktur response API Anda
            console.log("Attendance data fetched successfully", data);
            setAttendanceData(data);  // Set hasil data ke state
            setLastFetchedTime(new Date());
        } catch (e) {
            console.error("Error fetching attendance data: ", e);
            showErrorNotification(e, "Gagal mengambil data absensi");
        } finally {
            hideLoading();
        }
    };

    const handleDateChange = (date, dateString) => {
        console.log("Date changed: ", dateString);

        // Jika dateString kosong (misalnya ketika dihapus), set default ke hari ini
        const selectedDateValue = dateString ? dateString : moment().format('YYYY-MM-DD');
        
        setSelectedDate(selectedDateValue);
        fetchAttendanceData(selectedDateValue);  // Panggil fetch dengan tanggal yang telah disesuaikan
    };

    // Function to handle download modal
    const handleDownloadReport = () => {
        console.log("Download report button clicked");
        setIsDownloadModalVisible(true);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredData = attendanceData.filter((item) =>
        item.fullName && item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Define the table columns
    const columns = [
        {
            title: "No",
            dataIndex: "id",
            width: "5%",
            align: "center",
            render: (text, record, index) =>
                index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: "Nama",
            dataIndex: "fullName", 
            key: "fullName",      
            width: "15%",
        },
        {
            title: "Mata Pelajaran",
            dataIndex: "subject",
            width: "15%",
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10%",
            render: (status) => (
                <Tag
                    color={
                        status === "LATE"
                            ? "red"
                            : status === "PRESENT"
                            ? "green"
                            : status === "EXCUSED"
                            ? "gold"
                            : "blue"
                    }
                >
                    {status === "LATE"
                        ? "Terlambat"
                        : status === "PRESENT"
                        ? "Hadir"
                        : status === "EXCUSED"
                        ? "Izin"
                        : "Sakit"}
                </Tag>
            ),
        },
        {
            title: "Tanggal",
            dataIndex: "date",
            width: "15%",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Waktu",
            dataIndex: "date",
            key: "time",
            width: "10%",
            render: (date) => moment(date).format('HH:mm'), // Format untuk hanya menampilkan jam
        },
        {
            title: "Aksi",
            dataIndex: "action",
            width: "15%",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        console.log("Viewing details for record: ", record);
                        // Generate Google Maps embed URL based on latitude and longitude
                        const mapEmbedUrl = `https://www.google.com/maps?q=${record.latitude},${record.longitude}&z=15&output=embed`;
                        // Set modal content with detailed attendance information
                        setModalContent(
                            <div>
                                <h2 className="text-center text-xl font-semibold mb-4">Detail Absensi Guru</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="font-normal">Nama</td>
                                                <td className="font-normal">: {record.fullName}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">Mata Pelajaran</td>
                                                <td className="font-normal">: {record.subject}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">Tanggal</td>
                                                <td className="font-normal">: {new Date(record.date).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">Waktu</td>
                                                <td className="font-normal">: {moment(record.date).format('HH:mm')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="font-normal">Status</td>
                                                <td className="font-normal">: {record.status === "LATE" ? "Terlambat" : record.status === "PRESENT" ? "Hadir" : record.status === "EXCUSED" ? "Izin" : "Sakit"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">Catatan</td>
                                                <td className="font-normal">: {record.notes ? record.notes : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">File</td>
                                                <td className="font-normal">
                                                : {record.fileUrl ? (
                                                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">Lihat File</a>
                                                    ) : "-"} {/* Menampilkan '-' jika fileUrl tidak ada */}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <iframe
                                    src={mapEmbedUrl}
                                    width="100%"
                                    height="300px"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="mt-4"
                                ></iframe>
                            </div>
                        );
                        setIsModalVisible(true);
                    }}
                >
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">Data Absensi Guru</h1>
                    <div className="flex w-full justify-between mt-6 mb-4">
                        <div className="flex gap-4">
                            <Select
                                defaultValue={pageSize}
                                style={{ width: 100 }}
                                onChange={(value) => {
                                    console.log("Page size changed: ", value);
                                    setPageSize(value);
                                }}
                            >
                                <Option value={10}>10</Option>
                                <Option value={25}>25</Option>
                                <Option value={50}>50</Option>
                            </Select>
                            <DatePicker
                                defaultValue={moment()}
                                format="YYYY-MM-DD"
                                onChange={handleDateChange}
                            />
                           
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="hidden"
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadReport}
                            >
                                Download
                            </Button>
                            <Search
                                placeholder="Cari Absensi Guru"
                                allowClear
                                onChange={handleSearchChange}
                                style={{ width: 200 }}
                            />
                        </div>
                        
                    </div>

                    <div className="mb-4">
                        <p>Data ini terakhir diambil pada: {lastFetchedTime ? moment(lastFetchedTime).format('HH:mm:ss') : 'Belum ada data'}</p>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            onChange: (page, pageSize) => {
                                console.log("Page changed: ", page, "Page size: ", pageSize);
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

            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    console.log("Modal closed");
                    setIsModalVisible(false);
                }}
                width={800}
            >
                {modalContent}
            </Modal>


            {useModalDownload({
                isDownloadModalVisible,
                setIsDownloadModalVisible,
                selectedYear,
                setSelectedYear,
                selectedMonth,
                setSelectedMonth,
            })}
           
            {loading && <Loading />}
        </Fragment>
    );
};

export default AbsensiGuruTable;
