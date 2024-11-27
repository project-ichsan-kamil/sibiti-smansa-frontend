import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input } from "antd";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import Utils from "../../utils/Utils";
import api from "../../config/axios";
import { showErrorNotification } from "../../components/template/Notification";

const { Option } = Select;
const { Search } = Input;

const SebDetailView = () => {
    const [sebData, setSebData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchSebData();
    }, []);

    // Fetch all active SEB data from API
    const fetchSebData = async () => {
        showLoading();
        try {
            const response = await api.get("/seb-exam/active");
            const data = response.data.data;
            setSebData(data);
            setFilteredData(data);  // Set initial data as filtered data
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data SEB");
        } finally {
            hideLoading();
        }
    };

    // Search functionality (filter data in the table) - Only by name
    const searchSeb = (value) => {
        const filtered = sebData.filter(
            (item) =>
                item.name.toLowerCase().includes(value.toLowerCase()) // Only search by name
        );
        setFilteredData(filtered);
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
            title: "Nama Ujian",
            dataIndex: "name",
            width: "30%",
        },
        {
            title: "Password",
            dataIndex: "password",
            width: "25%",
        },
        {
            title: "Exit Code",  // Added new column for Exit Code
            dataIndex: "exitCode",  // Ensure "exitCode" exists in your data
            width: "20%",
        }
    ];

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">SEB Konfigurasi</h1>
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

                        <Search
                            placeholder="Search SebExam"
                            allowClear
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setFilteredData(sebData);  // Reset the filter when search is cleared
                                }
                            }}
                            onSearch={searchSeb}  // Search only by name
                            style={{ width: 200 }}
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredData}  // Use filtered data instead of sebData
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
                </div>
            </CmsTemplate>

            {loading && <Loading />}
        </Fragment>
    );
};

export default SebDetailView;


