import React, { useState } from 'react';
import { Form, Button, Space, message, Row, Col, Card } from 'antd';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import CmsTemplate from '../../components/template/CmsTemplate';
import MyEditor from './MyEditor'; // Import komponen MyEditor

const SubmitSoal = () => {
  const [form] = Form.useForm();
  
  // Dummy data untuk soal
  const [questions, setQuestions] = useState([
    {
      questionText: 'Apa ibu kota Indonesia?',
      options: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'],
      correctAnswer: 'Jakarta',
      isCompleted: true,
    },
    {
      questionText: 'Siapa presiden pertama Indonesia?',
      options: ['Sukarno', 'Suharto', 'Habibie', 'Gus Dur'],
      correctAnswer: 'Sukarno',
      isCompleted: true,
    },
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: null,
      isCompleted: false,
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const handleEditorSave = (data) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].questionText = data;
    setQuestions(updatedQuestions);
  };

  const handleOptionEditorSave = (data, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[optionIndex] = data;
    setQuestions(updatedQuestions);
  };

  const saveQuestion = async () => {
    setLoading(true);
    try {
      // Simpan data ke server, di sini kita hanya menggunakan console log untuk dummy
      console.log('Data yang disimpan:', questions[currentQuestionIndex]);
      message.success('Soal berhasil disimpan.');
    } catch (error) {
      message.error('Gagal menyimpan soal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CmsTemplate>
      <div className="submit-soal-container" style={{ padding: '20px' }}>
        <h1 className="text-2xl font-semibold">Submit Soal</h1>

        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          {questions.map((question, index) => (
            <Col span={2} key={index}>
              <Card
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: question.isCompleted ? '#52c41a' : '#f0f0f0',
                  color: '#000',
                }}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Card>
            </Col>
          ))}
        </Row>
        <div className='w-full flex justify-end px-20'>
        {questions[currentQuestionIndex].isCompleted && (
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[currentQuestionIndex].isCompleted = false;
                  setQuestions(updatedQuestions);
                }}
              >
                Edit
              </Button>
            )}
        </div>
        <Form form={form} layout="vertical" style={{ width: '70%' }}>
          <Form.Item label={`Pertanyaan ${currentQuestionIndex + 1}`}>
            {questions[currentQuestionIndex].isCompleted ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: questions[currentQuestionIndex].questionText,
                }}
                style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}
              />
            ) : (
              <MyEditor
                heightEditor={300}
                onSave={handleEditorSave}
                initialData={questions[currentQuestionIndex].questionText}
              />
            )}
          </Form.Item>

          {/* Input untuk opsi jawaban menggunakan editor */}
          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <Form.Item
              key={optionIndex}
              label={`Opsi ${String.fromCharCode(65 + optionIndex)}`} // Opsi A, B, C, D
            >
              {questions[currentQuestionIndex].isCompleted ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: option,
                  }}
                  style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}
                />
              ) : (
                <MyEditor
                  heightEditor={200}
                  onSave={(data) => handleOptionEditorSave(data, optionIndex)}
                  initialData={option}
                />
              )}
            </Form.Item>
          ))}

          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveQuestion}
                loading={loading}
                disabled={!questions[currentQuestionIndex].questionText}
              >
                Simpan Soal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </CmsTemplate>
  );
};

export default SubmitSoal;
