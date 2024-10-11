import React from "react";
import { Modal, Select, Button } from "antd";
import moment from 'moment';

const useModalDownload = ({isDownloadModalVisible, setIsDownloadModalVisible, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) => {
    return (
        <Modal
            title="Download Report Absensi"
            visible={isDownloadModalVisible}
            onCancel={() => {
                setIsDownloadModalVisible(false);
            }}
            footer={null}
        >
            <div className="flex flex-col gap-4">
                <Select
                    defaultValue={selectedYear}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                        console.log("Selected year: ", value);
                        setSelectedYear(value);
                    }}
                >
                    {Array.from(
                        { length: 5 },
                        (_, i) => moment().year() - i
                    ).map((year) => (
                        <Option key={year} value={year}>
                            {year}
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue={selectedMonth}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                        console.log("Selected month: ", value);
                        setSelectedMonth(value);
                    }}
                >
                    {moment.months().map((month, index) => (
                        <Option key={index + 1} value={index + 1}>
                            {month}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    onClick={() => {
                        console.log(
                            `Generating report for year: ${selectedYear}, month: ${selectedMonth}`
                        );
                        // Call API to generate report
                    }}
                >
                    Download Excel
                </Button>
            </div>
        </Modal>
    );
};

export default useModalDownload;
