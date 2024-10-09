import React, { useState, useEffect, Fragment } from "react";
import { Table, Input, Tag, Select, Button, Modal, DatePicker } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import UserTemplate from "../../components/template/user/UserTemplate";
import Loading from "../../components/template/Loading";
import Utils from "../../utils/Utils";
import api from "../../config/axios";
import { showErrorNotification } from "../../components/template/Notification";
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const AbsensiGuruTable = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [lastFetchedTime, setLastFetchedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

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

    const fetchAttendanceData = async (name = "") => {
        console.log("Fetching attendance data...");
        showLoading();
        try {
            // Replace with your API call to fetch attendance data
            // const response = await api.get('/attendance', { params: { name: name, date: selectedDate } });
            // const data = response.data.data;
            const dummyData = [
                {
                    id: 1,
                    name: "John Doe",
                    subject: "Matematika",
                    status: "PRESENT",
                    date: "2024-10-01",
                    time: "08:30",
                    notes: "Datang tepat waktu",
                    fileUrl: "https://example.com/file1.jpg",
                    latitude: -6.200000,
                    longitude: 106.816666,
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    subject: "Bahasa Inggris",
                    status: "LATE",
                    date: "2024-10-01",
                    time: "09:00",
                    notes: "Terlambat karena macet",
                    fileUrl: "https://example.com/file2.jpg",
                    latitude: -6.210000,
                    longitude: 106.826666,
                },
                {
                    id: 3,
                    name: "Alice Johnson",
                    subject: "Fisika",
                    status: "EXCUSED",
                    date: "2024-10-01",
                    time: "08:45",
                    notes: "Izin ke dokter",
                    fileUrl: "https://example.com/file3.jpg",
                    latitude: -6.220000,
                    longitude: 106.836666,
                },
                {
                    id: 4,
                    name: "Bob Brown",
                    subject: "Kimia",
                    status: "PRESENT",
                    date: "2024-10-02",
                    time: "08:20",
                    notes: "Datang lebih awal",
                    fileUrl: "https://example.com/file4.jpg",
                    latitude: -6.230000,
                    longitude: 106.846666,
                },
            ];
            console.log("Attendance data fetched successfully");
            setAttendanceData(dummyData);
            setLastFetchedTime(new Date());
        } catch (e) {
            console.error("Error fetching attendance data: ", e);
            showErrorNotification(e, "Gagal mengambil data absensi");
        } finally {
            hideLoading();
        }
    };

    // Function to handle search input changes
    const searchAttendance = (value) => {
        console.log(`Searching attendance with value: ${value}`);
        if (value) {
            // Filter attendance data based on the input value
            const filteredData = attendanceData.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            console.log("Filtered attendance data: ", filteredData);
            setAttendanceData(filteredData);
        } else {
            // If input is cleared, refetch the original data
            fetchAttendanceData();
        }
    };

    // Function to handle date change
    const handleDateChange = (date, dateString) => {
        console.log("Date changed: ", dateString);
        setSelectedDate(dateString);
        fetchAttendanceData();
    };

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
            dataIndex: "name",
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
            dataIndex: "time",
            width: "10%",
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
                                                <td className="font-normal">: {record.name}</td>
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
                                                <td className="font-normal">: {record.time}</td>
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
                                                <td className="font-normal">: {record.notes}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-normal">File</td>
                                                <td className="font-normal">: <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">Lihat File</a></td>
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
            <UserTemplate>
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
                            
                        </div>
                       <div className="flex gap-2">
                       <DatePicker
                                defaultValue={moment()}
                                format="YYYY-MM-DD"
                                onChange={handleDateChange}
                            />
                        <Search
                            placeholder="Cari Absensi Guru"
                            allowClear
                            onChange={(e) => {
                                // Search attendance as user types
                                searchAttendance(e.target.value);
                            }}
                            style={{ width: 200 }}
                        />
                       </div>
                    </div>

                    <div className="mb-4">
                        <p>Data ini terakhir diambil pada: {lastFetchedTime ? moment(lastFetchedTime).format('HH:mm:ss') : 'Belum ada data'}</p>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={attendanceData}
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
            </UserTemplate>

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

            {loading && <Loading />}
        </Fragment>
    );
};

export default AbsensiGuruTable;