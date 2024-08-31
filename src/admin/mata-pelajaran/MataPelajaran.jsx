import React, { useState, useEffect, Fragment } from "react";
import { Table, Select, Input } from "antd";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import Utils from "../../utils/Utils";
import api from "../../config/axios";
import { showErrorNotification } from "../../components/template/Notification";

const { Option } = Select;
const { Search } = Input;

const MataPelajaran = () => {
    const [subjectData, setSubjectData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchSubjectData();
    }, []);

    const fetchSubjectData = async (name = "") => {
        showLoading();
        try {
            const response = await api.get(`/subjects?name=${name}`);
            const data = response.data.data;
            setSubjectData(data);
        } catch (e) {
            showErrorNotification(e, "Gagal mengambil data mata pelajaran");
        } finally {
            hideLoading();
        }
    };

    const searchSubject = (value) => {
        fetchSubjectData(value);
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
            dataIndex: "name",
            width: "30%",
        },
        {
            title: "Deskripsi",
            dataIndex: "description",
            width: "40%",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            width: "20%",
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <Fragment>
            <CmsTemplate>
                <div>
                    <h1 className="text-2xl font-semibold">Mata Pelajaran</h1>
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
                            placeholder="Search Subject"
                            allowClear
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    fetchSubjectData();
                                }
                            }}
                            onSearch={searchSubject}
                            style={{ width: 200 }}
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={subjectData}
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

export default MataPelajaran;
