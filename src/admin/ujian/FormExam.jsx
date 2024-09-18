import { Fragment } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    InputNumber,
    Switch,
} from "antd";
import CmsTemplate from "../../components/template/CmsTemplate";
import Loading from "../../components/template/Loading";
import { useFormExam } from "./hooks/useFormExam";
const { Option } = Select;

const examTypeWording = {
    KUIS : "KUIS",
    UH : "Ulangan Harian",
    UTS : "UTS",
    UAS : "UAS"
}

const duration = [10, 20, 30, 60, 90, 120, 150, 180];

const sumQuestion = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const sumOption = [4, 5, 6];

const FormExam = () => {
    const {
        form,
        onFinish,
        // tanggalMulai,
        setTanggalMulai,
        pesertaList,
        mataPelajaranList,
        kuisList,
        isGuru,
        handleChangeTypePeserta,
        handleDuplicateToggle,
        duplicateEnabled,
        randomize,
        setRandomize,
        shareQuestions,
        setShareQuestions,
        loading,
        examType,  // Ambil examType dari logic
    } = useFormExam();

    return (
        <Fragment>
            <CmsTemplate>
                <h1 className="text-2xl font-semibold">
                    {form.getFieldValue('id') ? "Edit Ujian" : `Tambah ${examTypeWording[examType]}`}
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
                                name="name"
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
                                        <Option value="KUIS">KUIS</Option>
                                        <Option value="UH">
                                            Ulangan Harian
                                        </Option>
                                        <Option value="UTS">UTS</Option>
                                        <Option value="UAS">UAS</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    className="w-1/2"
                                    name="subjectId"
                                    label="Mata Pelajaran"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih mata pelajaran!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Pilih Mata Pelajaran"
                                    >
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
                                    name="startDate"
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
                                        onChange={setTanggalMulai}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="duration"
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
                                        {duration.map((value) => (
                                            <Option key={value} value={value}>
                                                {value} Menit
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="w-full flex gap-5">
                                <Form.Item
                                    name="sumQuestion"
                                    label="Jumlah Soal"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pilih jumlah soal!",
                                        },
                                    ]}
                                    style={{ width: "33%" }}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Pilih Jumlah Soal"
                                    >
                                        {sumQuestion.map((value) => (
                                            <Option key={value} value={value}>
                                                {value}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="sumOption"
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
                                        {sumOption.map((value) => (
                                            <Option key={value} value={value}>
                                                {value}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item name="shareExam"  label="Share Questions" valuePropName="checked">
                                    <Switch
                                        checked={shareQuestions}
                                        onChange={setShareQuestions}
                                    />
                                </Form.Item>
                            </div>

                            <div className="w-full flex justify-between gap-5">
                                <Form.Item
                                    name="passingGrade"
                                    label="Nilai KKM"
                                    type="number"
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
                                        onChange={setRandomize}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="sameAsOtherExam"
                                    label="Duplikat Ujian"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={duplicateEnabled}
                                        onChange={handleDuplicateToggle}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="otherExamId"
                                    label="Pilih Ujian yang akan diduplikat"
                                    className="w-4/12"
                                >
                                    <Select
                                        placeholder="Pilih Ujian"
                                        disabled={!duplicateEnabled}
                                    >
                                        {kuisList.map((kuis) => (
                                            <Option
                                                key={kuis.id}
                                                value={kuis.id}
                                            >
                                                {kuis.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="flex gap-5">
                                <Form.Item
                                    className="w-2/12"
                                    name="participantType"
                                    label="Pilih Peserta"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Pilih jenis peserta ujian!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Pilih Peserta"
                                        onChange={handleChangeTypePeserta}
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="CLASS">Per Kelas</Option>
                                        <Option value="USER">Per Siswa</Option>
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

export default FormExam;
