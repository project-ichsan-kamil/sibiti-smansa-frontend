import React, { Fragment, useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';
import CmsTemplate from '../../../components/CmsTemplate';
import FormKuisHooks from './hooks/FormKuisHooks';
import Loading from '../../../components/Loading';
import ModalPopup from '../../../components/ConfirmModal';

const { Option } = Select;

const CreateKuisForm = () => {
    const [form] = Form.useForm();
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [pesertaList, setPesertaList] = useState([])
    const { getMataPelajaran, getKelasList, getAllSiswa, addKuis, mataPelajaranList, siswaList, kelasList, loading } = FormKuisHooks();

    const onFinish = (values) => {
        ModalPopup({
            title: "Apakah anda ingin simpan data ini?",
            onOk: () => {
                addKuis(values);
            },
            content: "Klik Ok untuk simpan data",
        }).showConfirm()
    };

    const handleChangeUjian = (value) =>{
        form.resetFields(['pesertaUjian'])
        if(value == 1){
            setPesertaList(kelasList)
        }else{
            setPesertaList(siswaList);
        }
    }

    useEffect(() => {
        // init mata pelajaran
        getMataPelajaran()

        //init kelas
        getKelasList();

        //get semua siswa
        getAllSiswa()

        //init type ujian
        form.setFieldValue("type", "1")
        
        //TODO get mata pelajaran guru yang login
        form.setFieldValue("mataPelajaranId", 10)
    }, [])


    return (
        <Fragment>
            <CmsTemplate>
                <h1 className="text-2xl font-semibold">Tambah Ujian</h1>
                <Form form={form} layout="vertical" onFinish={onFinish} size='middle'>
                    <div style={{ width: "70%", display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, margin: '16px' }}>
                            <Form.Item name="nama" label="Judul Ujian" rules={[{ required: true, message: 'Masukkan judul kuis!' }]}>
                                <Input />
                            </Form.Item>
                            <div className='flex gap-5'>
                                <Form.Item
                                    className='w-1/2'
                                    name="type"
                                    label="Type Ujian"
                                    rules={[{ required: true, message: 'Pilih type kuis!' }]}
                                >
                                    <Select
                                        disabled={true}
                                        placeholder="Pilih Type Ujian">
                                        <Option value="1">Kuis</Option>
                                        <Option value="2">Ulangan Harian</Option>
                                        <Option value="3">UTS</Option>
                                        <Option value="4">UAS</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className='w-1/2'
                                    name="mataPelajaranId"
                                    label="Mata Pelajaran"
                                    rules={[{ required: true, message: 'Pilih mata pelajaran!' }]}>
                                    <Select
                                        placeholder="Pilih Mata Pelajaran"
                                        // disabled={true}
                                        >
                                        {mataPelajaranList.map((value) => (
                                            <Option key={value.id} value={value.id}>{value.nama}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="w-full flex">
                                <Form.Item
                                    name="mulai"
                                    label="Tanggal Mulai"
                                    style={{ width: '100%', paddingRight: '20px' }}
                                    rules={[{ required: true, message: 'Pilih tanggal mulai!' }]}>
                                    <DatePicker
                                        className='w-full'
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="Pilih Tanggal Mulai"
                                        onChange={(value) => setTanggalMulai(value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="selesai"
                                    label="Tanggal Selesai"
                                    style={{ width: '100%' }}
                                    dependencies={['tanggalMulai']}
                                    rules={[
                                        { required: true, message: 'Pilih tanggal selesai!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || !tanggalMulai || value.isAfter(tanggalMulai)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tanggal selesai harus setelah tanggal mulai!'));
                                            },
                                        }),
                                    ]}>
                                    <DatePicker
                                        placeholder="Pilih Tanggal Selesai"
                                        className='w-full'
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                    />
                                </Form.Item>
                            </div>
                            <div className='w-full flex'>
                                <Form.Item
                                    name="durasi"
                                    label="Durasi Ujian"
                                    rules={[{ required: true, message: 'Pilih durasi ujian!' }]}
                                    style={{ width: '33%', paddingRight: '20px' }}>
                                    <Select
                                        style={{ width: "100%" }}
                                        allowClear
                                        showSearch
                                        placeholder="Pilih Durasi"
                                        optionFilterProp="children"
                                    >
                                        <Option value="10">10 Menit</Option>
                                        <Option value="20">20 Menit</Option>
                                        <Option value="30">30 Menit</Option>
                                        <Option value="60">60 Menit</Option>
                                        <Option value="90">90 Menit</Option>
                                        <Option value="120">120 Menit</Option>
                                        <Option value="150">150 Menit</Option>
                                        <Option value="180">180 Menit</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="jumlahSoal"
                                    label="Jumlah Soal"
                                    rules={[{ required: true, message: 'Pilih jumlah soal!' }]}
                                    style={{ width: '33%', paddingRight: '20px' }}  >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Pilih Jumlah Soal"
                                    >
                                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((value) => (
                                            <Option key={value} value={value}>{value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="jumlahOpsi"
                                    label="Jumlah Opsi"
                                    rules={[{ required: true, message: 'Pilih jumlah opsi!' }]}
                                    style={{ width: '34%' }}  >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Pilih Jumlah Opsi"
                                    >
                                        {[4, 5, 6].map((value) => (
                                            <Option key={value} value={value}>{value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className='flex gap-5'>
                                <Form.Item
                                    className='w-2/12'
                                    name="typePeserta"
                                    label="Pilih Ujian"
                                    rules={[{ required: true, message: 'Pilih ujian!' }]}>
                                    <Select
                                        placeholder="Pilih Ujian"
                                        onChange={handleChangeUjian}
                                        style={{ width: "100%" }}>
                                        <Option value="1">Per Kelas</Option>
                                        <Option value="2">Per Siswa</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className='w-10/12'
                                    name="peserta"
                                    label="Pilih Peserta "
                                    rules={[{ required: true, message: 'Pilih peserta ujian!' }]}>
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        placeholder="Pilih Peserta Ujian"
                                        optionFilterProp="children"
                                    >
                                          {pesertaList.map((value) => (
                                            <Option key={value.id} value={value.id}>{value.nama}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className='flex gap-5'>
                                <Form.Item
                                    name="totalNilai"
                                    label="Total Nilai"
                                    rules={[{ required: true, message: 'Masukan total nilai!' }]}
                                    style={{ width: "33%" }}>
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder='Masukan Total Nilai' />
                                </Form.Item>

                                <Form.Item
                                    name="nilaiKkm"
                                    label="Nilai KKM"
                                    rules={[{ required: true, message: 'Masukan nilai KKM!' }]}
                                    style={{ width: "33%" }}>
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder='Masukan Nilai KKM' />
                                </Form.Item>

                                <Form.Item
                                    name="statusUjian"
                                    label="Status Ujian"
                                    rules={[{ required: true, message: 'Pilih Status!' }]}
                                    style={{ width: "33%" }}>
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="Pilih Status">
                                        <Option value="1">Publish</Option>
                                        <Option value="2">Draft</Option>
                                       
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <div className='gap-3 flex justify-end'>
                                <Button type="default" onClick={() => window.location.href = "/cms/kuis"}>
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

