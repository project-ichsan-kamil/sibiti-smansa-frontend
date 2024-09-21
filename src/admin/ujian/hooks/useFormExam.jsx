import { useState, useEffect } from "react";
import { Form, notification } from "antd";
import { useParams, useLocation } from "react-router-dom";
import api from "../../../config/axios";
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../components/template/Notification";
import Utils from "../../../utils/Utils";
import ModalPopup from "../../../components/template/ConfirmModal";
import { EXAM_API } from "../../../config/ApiConstants";

export const useFormExam = () => {
    const { id } = useParams();
    const location = useLocation();
    const [form] = Form.useForm();
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [pesertaList, setPesertaList] = useState([]);
    const [mataPelajaranList, setMataPelajaranList] = useState([]);
    const [kelasList, setKelasList] = useState([]);
    const [siswaList, setSiswaList] = useState([]);
    const [kuisList, setKuisList] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [duplicateEnabled, setDuplicateEnabled] = useState(false);
    const [randomize, setRandomize] = useState(false);
    const [shareQuestions, setShareQuestions] = useState(false);

    const examType = location.pathname.split("/")[2].toUpperCase();

    useEffect(() => {
        initializeForm();
        form.setFieldValue("randomize", true)
        form.setFieldValue("shareExam", false)
    }, [id]);

    const initializeForm = async () => {
        showLoading();
        try {
            await fetchInitialData();
            if (id) {
                await fetchKuisById(id);
            } else {
                form.setFieldsValue({ type: examType });
            }
        } catch (error) {
            showErrorNotification(error, "Gagal menginisialisasi form");
        } finally {
            hideLoading();
        }
    };

    const fetchInitialData = async () => {
        try {
            const mataPelajaranRes = await api.get(
                EXAM_API.getSubjectBaseOnGuru
            );
            setMataPelajaranList(mataPelajaranRes.data.data);
        } catch (error) {
            showErrorNotification(error, "Gagal mengambil data mata pelajaran");
        }
    };

    const fetchKuisById = async (id) => {
        try {
            const kuisRes = await api.get(`/kuis/${id}`);
            form.setFieldsValue(kuisRes.data.data);
        } catch (error) {
            showErrorNotification(error, "Gagal mengambil data kuis");
        }
    };


    const checkStartDate = (startDate) => {
        const now = new Date();
        return new Date(startDate) < now;
    };
    
    const onFinish = (values) => {
        if (checkStartDate(values.startDate)) {
            notification.error({
                message: "Data Tidak Valid",
                description: "Tanggal mulai sudah lewat dari waktu sekarang. Silakan periksa kembali data Anda.",
            });         
        } else {
            ModalPopup({
                title: "Apakah anda ingin simpan data ini?",
                onOk: () => saveExam(values),
                content: "Klik Ok untuk simpan data",
            }).showConfirm();
        }
    };
   

    const saveExam = async (values) => {
        console.log(values);
        showLoading();
        try {
            if (id) {
                await api.patch(`/kuis/${id}`, {
                    ...values,
                    subjectId: Number(values.subjectId),
                    otherExamId: Number(values.otherExamId),
                    sameAsOtherExam: values.sameAsOtherExam || false,
                    ...(values.participantType == "CLASS" 
                        ? { classIds: values.peserta.join(",") } 
                        : { userIds: values.peserta.join(",") }),
                });
                showSuccessNotification("Kuis berhasil diperbarui");
            } else {
                await api.post("/exam/create-quiz-daily-exam", {
                    ...values,
                    subjectId: Number(values.subjectId),
                    otherExamId: Number(values.otherExamId),
                    sameAsOtherExam: values.sameAsOtherExam || false,
                    ...(values.participantType == "CLASS" 
                        ? { classIds: values.peserta.join(",") } 
                        : { userIds: values.peserta.join(",") }),
                });
                showSuccessNotification("Kuis berhasil dibuat");
            }
            window.location.href = "/cms/kuis";
        } catch (error) {
            showErrorNotification(error, "Gagal menyimpan kuis");
        } finally {
            hideLoading();
        }
    };

    const handleChangeTypePeserta = async (value) => {
        form.resetFields(["peserta"]);
        if (value === "CLASS") {
            setPesertaList(
                kelasList.length === 0 ? await fetchKelas() : kelasList
            );
        } else if (value === "USER") {
            setPesertaList(
                siswaList.length === 0 ? await fetchSiswa() : siswaList
            );
        }
    };

    const fetchKelas = async () => {
        const kelasRes = await api.get("/classes");
        setKelasList(kelasRes.data.data);
        return kelasRes.data.data;
    };

    const fetchSiswa = async () => {
        const siswaRes = await api.get("/classes/students");
        setSiswaList(siswaRes.data.data);
        return siswaRes.data.data;
    };

    const handleDuplicateToggle = async (checked) => {
        if (checked) {
            let subjectId = form.getFieldValue("subjectId") || 0;
            console.log(subjectId);

            if (subjectId === 0) {
                notification.error({
                    message: "Error",
                    description:
                        "Pilih mata pelajaran terlebih dahulu sebelum mengaktifkan duplikasi",
                });
                setDuplicateEnabled(false);
                return;
            } else {
                try {
                    const kuisRes = await api.get("/exam", {
                        params: {
                            statusExam: ["PUBLISH"],
                            examType: "KUIS",
                            subjectId: subjectId, // subjectId dari mata pelajaran yang dipilih
                        },
                    });
                    console.log(kuisRes);
                    setKuisList(kuisRes.data.data); // Set daftar kuis hanya jika belum ada
                } catch (error) {
                    showErrorNotification(
                        error,
                        "Gagal mengambil daftar kuis untuk duplikasi"
                    );
                    setDuplicateEnabled(false); // Matikan toggle jika terjadi kesalahan API
                }
            }
        }

        setDuplicateEnabled(checked);
        if (!checked) {
            form.resetFields(["otherExamId"]);
        }
    };

    return {
        form,
        onFinish,
        tanggalMulai,
        setTanggalMulai,
        pesertaList,
        mataPelajaranList,
        kuisList,
        handleChangeTypePeserta,
        handleDuplicateToggle,
        duplicateEnabled,
        randomize,
        setRandomize,
        shareQuestions,
        setShareQuestions,
        loading,
        examType,
    };
};
