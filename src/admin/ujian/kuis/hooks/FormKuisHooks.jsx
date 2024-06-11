import { useState } from 'react';
import { message } from 'antd';
import KuisService from '../../../../api/admin/KuisApi';
import Utils from '../../../../utils/Utils';

const FormKuisHooks = () => {
    const [mataPelajaranList, setMataPelajaranList] = useState([])
    const [kelasList, setKelasList] = useState([])
    const [siswaList, setSiswaList] = useState([])
    const [kuisById, setKuisById] = useState({})
    const { showLoading, hideLoading, loading } = Utils()

    const addKuis = async (kuis) =>{
        showLoading();
        const {data, error} = await KuisService.addKuis(kuis);
        if (error) {
            message.error(error);
            hideLoading()
        } else {
            hideLoading()
            message.success("Berhasil tambah data");
            setTimeout(() => {
                window.location.href = "/cms/kuis";
            }, 1500);
        }
    }
    const getMataPelajaran = async () =>{
        showLoading()
        const {data, error} = await KuisService.getAllMataPelajaran();
        if (error) {
            message.error(error);
            hideLoading()
        } else {
            setMataPelajaranList(data);
            hideLoading()
        }
    }
    
    const getKelasList = async () =>{
        showLoading()
        const {data, error} = await KuisService.getAllKelas();
        if (error) {
            message.error(error);
            hideLoading()
        } else {
            setKelasList(data)
            hideLoading()
        }
    }

    const getAllSiswa = async () => {
        showLoading()
        const {data, error} = await KuisService.getAllSiswa();
        if (error) {
            message.error(error);
            hideLoading()
        } else {
            setSiswaList(data)
            hideLoading()
        }
    }

    const getKuisById = async (id) => {
        showLoading();
        const { data, error } = await KuisService.getKuisById(id);
        if (error) {
            message.error(error);
            hideLoading();
        } else {
            hideLoading()
            console.log(data);
            return data
        }
    };

  return {
    getMataPelajaran,
    getKelasList,
    getAllSiswa,
    addKuis,
    getKuisById,
    kuisById,
    siswaList,
    kelasList,
    mataPelajaranList,
    loading
  }
}

export default FormKuisHooks;
