import React from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import {
    SyncOutlined,
    DollarOutlined,
    DatabaseOutlined,
    HeartOutlined,
} from "@ant-design/icons";
import LineChart from "../../components/chart/LineChart";
import BarChart from "../../components/chart/BarChart";
import CmsTemplate from "../../components/template/CmsTemplate";

const { Header, Content } = Layout;

const Dashboard = () => {
    return (
        <CmsTemplate>
            <Layout style={{ minHeight: "100vh" }}>
                <Content style={{ padding: "24px" }}>
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Capacity"
                                    value="150GB"
                                    valueStyle={{ color: "#faad14" }}
                                    prefix={<DatabaseOutlined />}
                                />
                                <div
                                    style={{ marginTop: 10, color: "#8c8c8c" }}
                                >
                                    <SyncOutlined spin /> Update Now
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Revenue"
                                    value="$1,345"
                                    valueStyle={{ color: "#3f8600" }}
                                    prefix={<DollarOutlined />}
                                />
                                <div
                                    style={{ marginTop: 10, color: "#8c8c8c" }}
                                >
                                    Last day
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Errors"
                                    value={23}
                                    valueStyle={{ color: "#cf1322" }}
                                    prefix={<DatabaseOutlined />}
                                />
                                <div
                                    style={{ marginTop: 10, color: "#8c8c8c" }}
                                >
                                    In the last hour
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Followers"
                                    value="+45K"
                                    valueStyle={{ color: "#1890ff" }}
                                    prefix={<HeartOutlined />}
                                />
                                <div
                                    style={{ marginTop: 10, color: "#8c8c8c" }}
                                >
                                    <SyncOutlined spin /> Update now
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                        <Col span={16}>
                            <Card title="Sales Value">
                                <LineChart />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Total Orders">
                                <BarChart />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </CmsTemplate>
    );
};

export default Dashboard;
