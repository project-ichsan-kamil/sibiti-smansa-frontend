import api from '../../../config/axios';
import { showErrorNotification } from '../../../components/template/Notification';

export const fetchExamDetails = async (examId, showLoading, hideLoading, setExamDetails) => {
  showLoading();
  try {
    const response = await api.get(`/exam/get-by`, { params: { id: examId } });
    const data = response.data.data;

    setExamDetails({
      title: data.name || '',
      examType: data.type || '',
      subject: typeof data.subject === 'object' && data.subject !== null ? data.subject.name : data.subject || '',
      duration: data.duration || '',
      sumQuestion: data.sumQuestion,
    });

  } catch (error) {
    showErrorNotification('Error', 'Failed to fetch exam details');
  } finally {
    hideLoading();
  }
};

export const checkAnswerExists = async (examId, setAnswerExists, showLoading, hideLoading) => {
  showLoading();
  try {
    const answerResponse = await api.get(`/answer/check`, { params: { examId } });
    setAnswerExists(answerResponse.data.exists);
  } catch (error) {
    showErrorNotification('Error', 'Failed to check if answer exists');
  } finally {
    hideLoading();
  }
};

export const startExam = async (examId, showLoading, hideLoading, navigate) => {
  showLoading();
  try {
    await api.post(`/answer/start`, { examId });
    navigate(`/ujian/progress/${examId}/1`);
  } catch (error) {
    showErrorNotification('Error', 'Failed to start the exam');
  } finally {
    hideLoading();
  }
};
