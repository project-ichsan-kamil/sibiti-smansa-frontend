import React, { useState, useEffect } from "react";
import { Form, Button, Space, notification} from "antd";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import CmsTemplate from "../../components/template/CmsTemplate";
import MyEditor from "./MyEditor"; 
import api from "../../config/axios";
import { useParams } from "react-router-dom";
import $ from "jquery";
import { showErrorNotification, showSuccessNotification } from "../../components/template/Notification";
import Loading from "../../components/template/Loading";
import Utils from "../../utils/Utils";

const SubmitSoal = () => {
    const [form] = Form.useForm();
    const [listNumberQuestion, setListNumberQuestion] = useState([]);
    const [questions, setQuestions] = useState([]);
    const { showLoading, hideLoading, loading } = Utils();
    const [show, setShow] = useState(false)

    const { examId, questionNumber } = useParams();

    useEffect(() => {
        // Fungsi untuk mengambil daftar nomor pertanyaan dari API
        showLoading()
        const fetchListNumberQuestion = async () => {
            try {
                const response = await api.get(`/questions/exam`, {
                    params: {
                        examId: examId,
                    },
                });
                // Mengambil hanya questionNumber dan complete
                const numberQuestions = response.data.data.map((question) => ({
                    questionNumber: question.questionNumber,
                    isCompleted: question.complete,
                }));
                setListNumberQuestion(numberQuestions);
            } catch (error) {
                showErrorNotification(error, "Gagal mengambil data nomor soal")
            }finally{
                hideLoading()
            }
        };

        // Ambil daftar nomor pertanyaan saat halaman dimuat atau saat examId berubah
        fetchListNumberQuestion();
    }, [examId]);

    useEffect(() => {
        const fetchQuestions = async () => {
            showLoading()
            try {
                const response = await api.get(
                    `/questions?examId=${examId}&questionNumber=${questionNumber}`
                );
                const question = response.data.data
                // Memformat data sesuai dengan respons yang diberikan
                const formattedQuestions = {
                        questionText: question.question || "",
                        options: [
                            question.A || "",
                            question.B || "",
                            question.C || "",
                            question.D || "",
                            question.E || "",
                        ],
                        correctAnswer: question.key || "", // Simpan jawaban yang benar
                        isCompleted: question.complete,
                        questionNumber: question.questionNumber, // Menambahkan nomor soal ke format
                    }

                setQuestions(formattedQuestions);
              

            } catch (error) {
                showErrorNotification(error, "Gagal mengambil data soal")
            }finally{
                hideLoading()
                setShow(true)
            }
        };

        setShow(false)
        fetchQuestions();
    }, [examId, questionNumber]);

    const handleCorrectAnswerChange = (selectedOption) => {
        const updatedQuestions = {...questions};
        updatedQuestions.correctAnswer = selectedOption;
        setQuestions(updatedQuestions);
    };

    const saveQuestion = async () => {
        // Ambil konten dari editor utama (pertanyaan)
        const editorContent = $('#question').parent().find('.tox-tinymce iframe').contents().find("body").html();
        
        // Salin dan perbarui data pertanyaan
        const updatedQuestions = { ...questions };
        updatedQuestions.questionText = editorContent;

        // Ambil konten dari setiap editor opsi dan lakukan validasi
        updatedQuestions.options = updatedQuestions.options.map((option, index) => {
            const optionContent = $(`#opsi-${index}`).parent().find('.tox-tinymce iframe').contents().find("body").html();
            return optionContent;
        });
    
        // Siapkan data untuk API
        const dataToUpdate = {
            examId: parseInt(examId, 10),
            questionNumber: parseInt(updatedQuestions.questionNumber, 10),
            question: updatedQuestions.questionText,
            A: updatedQuestions.options[0] || "", 
            B: updatedQuestions.options[1] || "", 
            C: updatedQuestions.options[2] || "",
            D: updatedQuestions.options[3] || "", 
            E: updatedQuestions.options[4] || "", 
            F: updatedQuestions.options[5] || "", 
            key: updatedQuestions.correctAnswer,  
        };

        if (!dataToUpdate.key || dataToUpdate.key.trim() === "") {
            notification.error({
                message: "Error",
                description: "Kunci jawaban tidak boleh kosong",
            });
            return;
        }
    
        try {
            showLoading()
           const response = await api.patch('/questions', dataToUpdate, {
                params: {
                    examId: dataToUpdate.examId,
                    questionNumber: dataToUpdate.questionNumber,
                },
            });
            
            showSuccessNotification("Success", "Soal berhasil disimpan")
            setTimeout(() => {
                window.location.reload();
            }, 500); 
        } catch (error) {
            showErrorNotification(error, "Gagal menyimpan soal")
        } finally {
            hideLoading()
        }
    };
    

    return (
        <CmsTemplate>
            <div className="submit-soal-container" style={{ padding: "20px" }}>
                <h1 className="text-2xl font-semibold">Submit Soal</h1>

                <div className="flex flex-wrap mb-5">
                    {listNumberQuestion.map((question, index) => (
                        <div key={index} className="m-1">
                            <div
                                className={`cursor-pointer ${
                                    question.questionNumber == questionNumber
                                        ? "bg-active text-white"
                                        : question.isCompleted
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                } w-10 h-10 flex items-center justify-center rounded`}
                                onClick={() => {
                                    window.location.href = `/cms/submit-soal/${examId}/${question.questionNumber}`
                                }}
                            >
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
              
                <div className="w-full flex justify-end px-20">
                    {questions.isCompleted && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                const updatedQuestions = {...questions};
                                updatedQuestions.isCompleted = false;
                                setQuestions(updatedQuestions);
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </div>

                {show && <>
                  <Form form={form} layout="vertical" style={{ width: "100%" }}>
                      <Form.Item label={`Pertanyaan ${questionNumber}`}>
                          {questions.isCompleted ? (
                              <div
                                  dangerouslySetInnerHTML={{
                                      __html: questions.questionText,
                                  }}
                                  style={{
                                      backgroundColor: "#f5f5f5",
                                      padding: "10px",
                                      borderRadius: "5px",
                                  }}
                              />
                          ) : (
                              <MyEditor
                                  editorId={`question`} 
                                  heightEditor={300}
                                  initialData={
                                      questions?.questionText
                                  }
                              />
                          )}
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Menggunakan grid dengan dua kolom */}
                          <div className="flex flex-col">
                              {/* Kolom Kanan: A, B, C */}
                              {questions?.options.map(
                                  (option, optionIndex) => (
                                      <div key={optionIndex}>
                                          {optionIndex < 3 ? ( // Menampilkan A, B, C
                                              <Form.Item
                                                  className="w-full"
                                                  label={
                                                      <span className="font-bold bg-blue-400 w-7 h-7 flex justify-center items-center text-white rounded-full">{`${String.fromCharCode(
                                                          65 + optionIndex
                                                      )}`}</span>
                                                  }
                                              >
                                                  {questions?.isCompleted ? (
                                                      <div
                                                          dangerouslySetInnerHTML={{
                                                              __html: option,
                                                          }}
                                                          style={{
                                                              backgroundColor:
                                                                  "#f5f5f5",
                                                              padding: "10px",
                                                              borderRadius: "5px",
                                                          }}
                                                      />
                                                  ) : (
                                                      <MyEditor
                                                          editorId={`opsi-${optionIndex}`}
                                                          heightEditor={200}
                                                          initialData={option}
                                                      />
                                                  )}
                                              </Form.Item>
                                          ) : null}
                                      </div>
                                  )
                              )}
                          </div>
                          <div className="flex flex-col">
                              {questions.options.map(
                                  (option, optionIndex) => (
                                      <div
                                          key={optionIndex}
                                          className={`${
                                              optionIndex > 2 ? "mb-2" : ""
                                          }`}
                                      >
                                          {optionIndex === 3 ||
                                          optionIndex === 4 ? ( // Menampilkan D dan E
                                              <Form.Item
                                                  className="w-full"
                                                  label={
                                                      <span className="font-bold bg-blue-400 w-7 h-7 flex justify-center items-center text-white rounded-full">{`${String.fromCharCode(
                                                          65 + optionIndex
                                                      )}`}</span>
                                                  }
                                              >
                                                  {questions?.isCompleted ? (
                                                      <div
                                                          dangerouslySetInnerHTML={{
                                                              __html: option,
                                                          }}
                                                          style={{
                                                              backgroundColor:
                                                                  "#f5f5f5",
                                                              padding: "10px",
                                                              borderRadius: "5px",
                                                          }}
                                                      />
                                                  ) : (
                                                      <MyEditor
                                                        editorId={`opsi-${optionIndex}`}
                                                          heightEditor={200}
                                                          initialData={option}
                                                      />
                                                  )}
                                              </Form.Item>
                                          ) : null}
                                      </div>
                                  )
                              )}
                          </div>
                      </div>

                      <Form.Item label="Kunci Jawaban">
                          <div className="flex flex-wrap">
                              {questions?.options.map(
                                  (option, optionIndex) => (
                                      <div key={optionIndex} className="m-2">
                                          <label className="flex items-center cursor-pointer">
                                              <input
                                                  type="radio"
                                                  name="correctAnswer"
                                                  value={String.fromCharCode(
                                                      65 + optionIndex
                                                  )}
                                                  checked={
                                                      questions.correctAnswer ===
                                                      String.fromCharCode(
                                                          65 + optionIndex
                                                      )
                                                  } // Cek apakah opsi ini adalah kunci jawaban
                                                  onChange={() =>
                                                      handleCorrectAnswerChange(
                                                          String.fromCharCode(
                                                              65 + optionIndex
                                                          )
                                                      )
                                                  } // Update kunci jawaban saat dipilih
                                                  className="mr-2 hidden" // Menyembunyikan input radio
                                              />
                                              <div
                                                  className={`w-10 h-10 text-center flex justify-center items-center border rounded ${
                                                      questions.correctAnswer ===
                                                      String.fromCharCode(
                                                          65 + optionIndex
                                                      )
                                                          ? "bg-green-500 text-white"
                                                          : "bg-gray-200"
                                                  }`}
                                              >
                                                  {String.fromCharCode(
                                                      65 + optionIndex
                                                  )}
                                              </div>
                                          </label>
                                      </div>
                                  )
                              )}
                          </div>
                      </Form.Item>

                    {!questions.isCompleted && <>
                      <Form.Item>
                          <Space>
                              <Button
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  onClick={saveQuestion}
                                  loading={loading}
                              >
                                  Simpan
                              </Button>
                          </Space>
                      </Form.Item>
                    </>}

                  </Form>
                </>}
            </div>
            {loading && <Loading/>}
        </CmsTemplate>
    );
};

export default SubmitSoal;
