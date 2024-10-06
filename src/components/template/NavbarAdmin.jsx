import React, { Fragment, useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios"; // Pastikan path ini benar
import { Roles } from "../../config/enum";
import { useAuthContext } from "../../context/useContext";
import Utils from "../../utils/Utils";
import { showErrorNotification, showSuccessNotification } from "./Notification";
import Loading from "./Loading";

const { Header } = Layout;

const NavbarAdmin = () => {
    const navigate = useNavigate();
    const { showLoading, hideLoading, loading } = Utils();
    const { currentUser } = useAuthContext();

    const handleLogout = () => {
        showLoading();
        api.post("/auth/logout")
            .then(() => {
                showSuccessNotification(
                    "Logout berhasil",
                    "Anda telah berhasil logout. Sampai jumpa lagi!"
                );

                navigate("/", { replace: true });
            })
            .catch((err) => {
                showErrorNotification(err, "Logout gagal, harap coba lagi");
            })
            .finally(() => {
                hideLoading();
            });
    };

    const handleMenuClick = ({ key }) => {
        if (key === "dashboard") {
            // Redirect based on the user's role
            if (["ADMIN", "SUPER_ADMIN", "GURU"].includes(userData.role)) {
                navigate("/cms/dashboard");
            } else if (userData.role === "SISWA") {
                navigate("/dashboard");
            } else {
                message.error("You do not have access to the dashboard.");
            }
        } else if (key === "profile") {
            navigate("/profile");
        } else if (key === "logout") {
            handleLogout();
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="dashboard">Dashboard</Menu.Item>
            <Menu.Item key="profile">Profile</Menu.Item>
            <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
    );

    return (
        <Fragment>
            <Header className="bg-purple-700 flex justify-between items-center w-full">
                <div>
                    <h1 className="text-white text-2xl font-semibold">
                        Smansa
                    </h1>
                </div>
                <div className="flex items-center">
                    {/* Display Fullname and Role */}
                    <Dropdown
                        overlay={menu}
                        trigger={["hover"]}
                        placement="bottomRight"
                    >
                        <div className="flex items-center cursor-pointer">
                            <Avatar
                                icon={<UserOutlined />}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "#87d068",
                                    marginRight: "12px",
                                }}
                            />
                            <div
                                className="text-white mr-2"
                                style={{ lineHeight: 1.2 }}
                            >
                                <p
                                    className="mb-0 font-semibold"
                                    style={{ marginBottom: "2px" }}
                                >
                                    {currentUser.fullName}
                                </p>
                                <p
                                    className="mb-0 text-xs"
                                    style={{
                                        marginTop: "0",
                                        marginBottom: "0",
                                    }}
                                >
                                    {currentUser.roles === Roles.SUPER_ADMIN
                                        ? "SUPER ADMIN"
                                        : currentUser.roles}
                                </p>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </Header>

            {loading && <Loading/>}
        </Fragment>
    );
};

export default NavbarAdmin;
