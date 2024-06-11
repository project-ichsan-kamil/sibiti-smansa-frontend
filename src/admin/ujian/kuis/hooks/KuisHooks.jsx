import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import "moment-timezone";
import KuisService from "../../../../api/admin/KuisApi";
import Utils from "../../../../utils/Utils";

const KuisHooks = () => {
    const [upcomingKuisData, setUpcomingKuisData] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();

    const getAllKuis = async () => {
        showLoading();
        const { data, error } = await KuisService.getAllKuis();
        if (error) {
            message.error(error);
            hideLoading();
        } else {
            setUpcomingKuisData(data);
            hideLoading();
        }
    };

    const deleteKuis = async (id) => {
        showLoading();
        const { data, error } = await KuisService.deleteKuis(id);
        if (error) {
            message.error(error);
            hideLoading();
        } else {
            message.success("Berhasil hapus data");
            setTimeout(() => {
                getAllKuis();
            }, 1500);
        }
    };  

    const convertToIndonesiaTime = (time) => {
        return moment.utc(time).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
    };

    return {
        getAllKuis,
        convertToIndonesiaTime,
        deleteKuis,
        upcomingKuisData,
        loading
    };
};

export default KuisHooks;
