import { useState } from "react";
import { message } from "antd";
import Utils from "../../../utils/Utils";
import axios from "axios";

const mataPelajaranHooks= (form, setKelasData) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { showLoading, hideLoading, loading, localUrl } = Utils();

    const handleEdit = async (id) => {
        showLoading();
        try {
            const response = await axios.get(`${localUrl}/api/classes/${id}`);
            const data = response.data.data;
            console.log(data);
            hideLoading();
            showModal();
            form.setFieldsValue({
                ...data,
                kelas: `Kelas ${data.kelas}`,
                status: data.status === 1 ? "Aktif" : "Tidak Aktif",
            });
        } catch (error) {
            hideLoading();
            message.error(error.message);
        }
    };

    const deleteData = async (id) => {
        showLoading();
        try {
            const response = await axios.delete(`${localUrl}/api/classes/${id}`);
            message.success(response.data.message);
            fetchData();
        } catch (error) {
            message.error(error.message);
        } finally {
            hideLoading();
        }
    };

    const handleSubmit = async () => {
        await form.validateFields();
        closeModal();
        showLoading();
        const data = form.getFieldsValue();
        const kelasData = {
            ...data,
            kelas: Number(data.kelas.split(" ")[1]),
            status: data.status === "Aktif" ? 1 : 0,
        };

        try {
            const axiosMethod = data.id
                ? axios.patch(`${localUrl}/api/classes/${data.id}`, kelasData)
                : axios.post(`${localUrl}/api/classes`, kelasData);

            await axiosMethod;
            message.success("Data berhasil disimpan");
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            hideLoading();
            fetchData();
        }
    };

    const searchKelas = async (e) => {
        console.log(e);
        showLoading();
        try {
            const response = await axios.get(`${localUrl}/api/classes/search?nama=${e}`)
            const data = response.data.data;
            setKelasData(data);
        } catch (error) {
            message.error(error.message);
        } finally {
            hideLoading();
        }
    };

    const fetchData = async () => {
        showLoading();
        try {
            const response = await axios.get(`${localUrl}/api/classes`);
            setKelasData(response.data.data);
        } catch (error) {
            message.error(error.message);
        } finally {
            hideLoading();
        }
    };

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
        console.log("Modal is now visible");
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return {
        handleEdit,
        showModal,
        closeModal,
        deleteData,
        fetchData,
        searchKelas,
        showLoading,
        hideLoading,
        handleSubmit,
        isModalVisible,
        loading,
    };
};

export default mataPelajaranHooks
