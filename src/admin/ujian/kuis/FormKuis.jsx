import React, { Fragment, useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Switch } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import CmsTemplate from "../../../components/template/CmsTemplate";
import Loading from "../../../components/template/Loading";
import ModalPopup from "../../../components/ConfirmModal";
import api from "../../../config/axios";
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../components/template/Notification";

const { Option } = Select;

const CreateKuisForm = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [pesertaList, setPesertaList] = useState([]);
    const [mataPelajaranList, setMataPelajaranList] = useState([]);
    const [kelasList, setKelasList] = useState([]);
    const [siswaList, setSiswaList] = useState([]);
    const [kuisList, setKuisList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [duplicateEnabled, setDuplicateEnabled] = useState(false);
    const [randomize, setRandomize] = useState(false);
    const [shareQuestions, setShareQuestions] = useState(false);

    useEffect(() => {
        // Initialize data
        fetchInitialData();

        if (id) {
            fetchKuisById(id);
        } else {
            // Set default value for type ujian to "Kuis" and disable it
            form.setFieldsValue({ type: "1" });
        }
    }, [id]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const mataPelajaranRes = await api.get('/subjects');
            setMataPelajaranList(mataPelajaranRes.data.data);
            // Fetch quiz list to prepare it for the dropdown even if it's disabled
            const kuisRes = await api.get('/kuis'); 
            setKuisList(kuisRes.data.data);
        } catch (error) {
            showErrorNotification(error, "Gagal mengambil data awal");
        } finally {
            setLoading(false);
        }
    };

    const fetchKuisById = async (kuisId) => {
        setLoading(true);
        try {
            const res = await api.get(`/kuis/${kuisId}`);
            const kuisData = res.data.data;
            form.setFieldsValue({
                ...kuisData,
                mulai: dayjs(kuisData.mulai),
                selesai: dayjs(kuisData.selesai),
                durasi: String(kuisData.durasi),
                type: String(kuisData.type),
                typePeserta: String(kuisData.typePeserta),
                peserta: kuisData.pesertaUjian.map((p) => p.userId || p.id),
                randomize: kuisData.randomize || false,
                duplicate: kuisData.duplicate || false,
                duplicateKuisId: kuisData.duplicateKuisId || null,
                share: kuisData.share || false,  // Load existing share status
            });
            setTanggalMulai(dayjs(kuisData.mulai));
            setRandomize(kuisData.randomize || false);
            setDuplicateEnabled(kuisData.duplicate || false);
            setShareQuestions(kuisData.share || false);  // Set share state
            setPesertaList(kuisData.typePeserta === "1" ? kelasList : siswaList);
        } catch (error) {
            showErrorNotification(error, "Gagal mengambil data kuis");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = (values) => {
        ModalPopup({
            title: "Apakah anda ingin simpan data ini?",
            onOk: () => {
                saveKuis(values);
            },
            content: "Klik Ok untuk simpan data",
        }).showConfirm();
    };

    const saveKuis = async (values) => {
        setLoading(true);
        try {
            if (id) {
                await api.patch(`/kuis/${id}`, values);
                showSuccessNotification("Kuis berhasil diperbarui");
            } else {
                await api.post("/kuis", values);
                showSuccessNotification("Kuis berhasil dibuat");
            }
            window.location.href = "/cms/kuis";
        } catch (error) {
            showErrorNotification(error, "Gagal menyimpan kuis");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeTypePeserta = async (value) => {
        form.resetFields(["peserta"]);
        if (value === "1") {
            // Per Kelas
            if (kelasList.length === 0) {
                try {
                    setLoading(true);
                    const kelasRes = await api.get("/classes");
                    setKelasList(kelasRes.data.data);
                    setPesertaList(kelasRes.data.data);
                } catch (error) {
                    showErrorNotification(error, "Gagal mengambil data kelas");
                } finally {
                    setLoading(false);
                }
            } else {
                setPesertaList(kelasList);
            }
        } else if (value === "2") {
            // Per Siswa
            if (siswaList.length === 0) {
                try {
                    setLoading(true);
                    const siswaRes = await api.get("/classes/students");
                    setSiswaList(siswaRes.data.data);
                    setPesertaList(siswaRes.data.data);
                } catch (error) {
                    showErrorNotification(error, "Gagal mengambil data siswa");
                } finally {
                    setLoading(false);
                }
            } else {
                setPesertaList(siswaList);
            }
        }
    };

    const handleDuplicateToggle = (checked) => {
        setDuplicateEnabled(checked);
        if (!checked) {
            form.resetFields(["duplicateKuisId"]);
        }
    };

    return (
        <Fragment>
            <CmsTemplate>
                <h1 className="text-2xl font-semibold">
                    {id ? "Edit Ujian" : "Tambah Ujian"}
                </h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="middle"
                >
                    <div
                        style={{
                            width: "70%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ flex: 1, margin: "16px" }}>
                            <Form.Item
                                name="nama"
                                label="Judul Ujian"
                                rules={[
                                    {
                                        required: true,
                                        message: "Masukkan judul kuis!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <div className="flex gap-5">
                                <Form.Item
                                    className="w-1/2"
                                    name="type"
                                    label="Type Ujian"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih type kuis!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Pilih Type Ujian"
                                        disabled
                                    >
                                        <Option value="1">Kuis</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className="w-1/2"
                                    name="mataPelajaranId"
                                    label="Mata Pelajaran"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih mata pelajaran!",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Pilih Mata Pelajaran">
                                        {mataPelajaranList.map((value) => (
                                            <Option
                                                key={value.id}
                                                value={value.id}
                                            >
                                                {value.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="w-full flex space-x-5">
                                <Form.Item
                                    name="mulai"
                                    label="Tanggal Mulai"
                                    className="w-1/2"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih tanggal mulai!",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        showTime={{ format: "HH:mm" }}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="Pilih Tanggal Mulai"
                                        onChange={(value) =>
                                            setTanggalMulai(value)
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="durasi"
                                    label="Durasi Ujian"
                                    className="w-1/2"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih durasi ujian!",
                                        },
                                    ]}
                                
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        allowClear
                                        placeholder="Pilih Durasi"
                                    >
                                        {[
                                            10, 20, 30, 60, 90, 120, 150, 180,
                                        ].map((value) => (
                                            <Option key={value} value={value}>
                                                {value} Menit
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="w-full flex gap-5">
                                <Form.Item
                                    name="jumlahSoal"
                                    label="Jumlah Soal"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih jumlah soal!",
                                        },
                                    ]}
                                    style={{
                                        width: "33%",
                                    }}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Pilih Jumlah Soal"
                                    >
                                        {[
                                            5, 10, 15, 20, 25, 30, 35, 40, 45,
                                            50,
                                        ].map((value) => (
                                            <Option key={value} value={value}>
                                                {value}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="jumlahOpsi"
                                    label="Jumlah Opsi"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih jumlah opsi!",
                                        },
                                    ]}
                                    style={{ width: "34%" }}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Pilih Jumlah Opsi"
                                    >
                                        {[4, 5, 6].map((value) => (
                                            <Option key={value} value={value}>
                                                {value}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="share"
                                    label="Share Questions"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={shareQuestions}
                                        onChange={(checked) => setShareQuestions(checked)}
                                    />
                                </Form.Item>
                                
                            </div>
                            <div className="w-full flex justify-between gap-5">
                            <Form.Item
                                    name="nilaiKkm"
                                    label="Nilai KKM"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Masukan nilai KKM!",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="Masukan Nilai KKM"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="randomize"
                                    label="Randomize Soal"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={randomize}
                                        onChange={(checked) => setRandomize(checked)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="duplicate"
                                    label="Duplikat Ujian"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={duplicateEnabled}
                                        onChange={handleDuplicateToggle}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="duplicateKuisId"
                                    label="Pilih Ujian yang akan diduplikat"
                                    className="w-4/12"
                                >
                                    <Select 
                                        placeholder="Pilih Ujian" 
                                        disabled={!duplicateEnabled} // Only enable if toggle is checked
                                    >
                                        {kuisList.map((kuis) => (
                                            <Option key={kuis.id} value={kuis.id}>
                                                {kuis.nama}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="flex gap-5">
                                <Form.Item
                                    className="w-2/12"
                                    name="typePeserta"
                                    label="Pilih Peserta"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih jenis peserta ujian!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Pilih Peserta"
                                        onChange={handleChangeTypePeserta}
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="1">Per Kelas</Option>
                                        <Option value="2">Per Siswa</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className="w-10/12"
                                    name="peserta"
                                    label="Pilih Peserta"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih peserta ujian!",
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        placeholder="Pilih Peserta Ujian"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        disabled={pesertaList.length === 0}
                                    >
                                        {pesertaList.map(
                                            ({
                                                userId,
                                                fullName,
                                                id,
                                                name,
                                            }) => (
                                                <Option
                                                    key={userId || id}
                                                    value={userId || id}
                                                >
                                                    {fullName || name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                </Form.Item>
                            </div>
                           
                            <Form.Item>
                                <div className="gap-3 flex justify-end">
                                    <Button
                                        type="default"
                                        onClick={() =>
                                            (window.location.href = "/cms/kuis")
                                        }
                                    >
                                        Batal
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Simpan
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </CmsTemplate>

            {loading && <Loading />}
        </Fragment>
    );
};

export default CreateKuisForm;
