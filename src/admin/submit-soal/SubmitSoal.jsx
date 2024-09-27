import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Space, message, Tooltip, Row, Col, Card } from 'antd';
import { SaveOutlined, CheckOutlined } from '@ant-design/icons';
import CmsTemplate from '../../components/template/CmsTemplate';
import api from '../../config/axios';
import MyEditor from './MyEditor'; // Import komponen MyEditor

const { Option } = Select;

const SubmitSoal = () => {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState(Array.from({ length: 10 }, () => ({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: null,
    isCompleted: false,
  }))); // Default 10 soal
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index soal yang sedang diinput
  const [loading, setLoading] = useState(false);
  const examId = window.location.pathname.split('/').pop(); // Mengambil examId dari URL

  const editorInstance = useRef(null);

  // Fungsi untuk menyimpan soal ke database
  const saveQuestions = async () => {
    if (questions.some(q => !q.isCompleted)) {
      message.warning('Semua soal harus dilengkapi sebelum disimpan.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/questions/create', {
        examId: examId,
        questions: questions,
      });
      message.success('Soal berhasil disimpan.');
      setQuestions(Array.from({ length: 10 }, () => ({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: null,
        isCompleted: false,
      })));
      setCurrentQuestionIndex(0);
      form.resetFields();
    } catch (error) {
      message.error('Gagal menyimpan soal.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorSave = (data) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].questionText = data;
    setQuestions(updatedQuestions);
  };

  return (
    <CmsTemplate>
      <div className="submit-soal-container" style={{ padding: '20px' }}>
        <h1 className="text-2xl font-semibold">Submit Soal</h1>

        {/* Daftar Soal */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          {questions.map((question, index) => (
            <Col span={2} key={index}>
              <Card
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: index === currentQuestionIndex ? '#1890ff' : question.isCompleted ? '#52c41a' : '#f0f0f0',
                  color: index === currentQuestionIndex ? '#fff' : '#000',
                }}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Card>
            </Col>
          ))}
        </Row>

        {/* Form untuk Input Soal */}
        <Form form={form} layout="vertical" style={{ width: '70%' }}>
          <Form.Item
            label={`Pertanyaan ${currentQuestionIndex + 1}`}
            required
            tooltip="Masukkan pertanyaan"
          >
            {questions[currentQuestionIndex].isCompleted ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: questions[currentQuestionIndex].questionText,
                }}
                style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}
              />
            ) : (
              <MyEditor
                onSave={handleEditorSave}
                initialData={questions[currentQuestionIndex].questionText} // Set initial data ke editor
              />
            )}
          </Form.Item>

          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <Form.Item
              key={optionIndex}
              label={`Opsi ${String.fromCharCode(65 + optionIndex)}`} // Opsi A, B, C, D
              required
              tooltip="Masukkan opsi jawaban"
            >
              {questions[currentQuestionIndex].isCompleted && questions[currentQuestionIndex].options[optionIndex] ? (
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                  {questions[currentQuestionIndex].options[optionIndex]}
                </div>
              ) : (
                <Input
                  placeholder={`Masukkan opsi ${String.fromCharCode(65 + optionIndex)}`}
                  value={option}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[currentQuestionIndex].options[optionIndex] = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  disabled={!questions[currentQuestionIndex].questionText || (optionIndex > 0 && !questions[currentQuestionIndex].options[optionIndex - 1])} // Disable jika pertanyaan belum diisi atau opsi sebelumnya belum diisi
                />
              )}
            </Form.Item>
          ))}

          <Form.Item label="Jawaban Benar" tooltip="Pilih jawaban yang benar">
            <Radio.Group
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex].correctAnswer = e.target.value;
                setQuestions(updatedQuestions);
              }}
              value={questions[currentQuestionIndex].correctAnswer}
              disabled={questions[currentQuestionIndex].options.some(opt => opt === '') || questions[currentQuestionIndex].isCompleted} // Disable jika ada opsi yang belum terisi atau soal sudah selesai
            >
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Radio key={index} value={option}>
                  {`Opsi ${String.fromCharCode(65 + index)}`}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Tooltip title="Tandai soal sebagai lengkap">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[currentQuestionIndex].isCompleted = true;
                    setQuestions(updatedQuestions);
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }
                  }}
                  disabled={questions[currentQuestionIndex].options.some(opt => opt === '') || !questions[currentQuestionIndex].correctAnswer} // Disable jika belum ada jawaban benar yang dipilih
                >
                  Tandai Selesai
                </Button>
              </Tooltip>
              <Button
                type="primary"
                onClick={saveQuestions}
                icon={<SaveOutlined />}
                loading={loading}
              >
                Simpan Semua Soal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </CmsTemplate>
  );
};

export default SubmitSoal;
