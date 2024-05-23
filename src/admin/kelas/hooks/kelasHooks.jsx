import { useState } from "react";
import { message } from "antd";
import Utils from "../../../utils/Utils"
import KelasService from "../../../api/admin/KelasApi";

const kelasHooks = (form, setKelasData) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { showLoading, hideLoading, loading } = Utils()
    const handleEdit = async (id) => {
        showLoading()
        const { data, error } = await KelasService.getKelasById(id);
        if (error) {
          hideLoading()
          message.error(error);
        } else {
          hideLoading()
          showModal()
          form.setFieldsValue(data);
        }
    }

    const deleteData = async (id) => {
        showLoading();
        const { data, error } = await KelasService.deleteKelas(id);
        console.log(data);
        if (error) {
            message.error(error.message);
            hideLoading()
        } else {
            message.success("Berhasil hapus data")
            fetchData()
            hideLoading()
        }
    }

    const handleSubmit = async (id) => {
        await form.validateFields();
        closeModal()
        showLoading();
        const data = form.getFieldsValue();
        if (data.id) {
          // Edit
          console.log("edit");
          const { error } = await KelasService.update(data.id, data.status, 1714289215503);
      
          if (error) {
            hideLoading();
            message.error(error);
            fetchData();
          } else {
            hideLoading();
            message.success("Data berhasil diupdate");
            fetchData();
          }
        } else {
          // Add
          const { error } = await KelasService.add(data.nama, data.status, 1714289215503);
          if (error) {
            hideLoading();
            message.error(error);
            fetchData();
          } else {
            hideLoading();
            message.success("Data berhasil disimpan");
            fetchData();
          }
        }
    };

    const searchKelas = async (e) => {
        showLoading()
        const { data, error } = await KelasService.searchingKelas(e.target.value);
        if (data) {
            setKelasData(data);
            hideLoading()
        } else if (error) {
            message.error(error.message);
            hideLoading()
        }
    }

    const fetchData = async () => {
        showLoading()
        const { data, error } = await KelasService.getAllKelas();
        if (data) {
            setKelasData(data);
            hideLoading()
        } else if (error) {
            message.error(error.message);
            hideLoading()
        }
    };


    const showModal = () => {
        form.resetFields()
        setIsModalVisible(true);
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
    loading
  }
}

export default kelasHooks