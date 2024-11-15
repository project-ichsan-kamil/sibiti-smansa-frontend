import { useState, useEffect } from 'react';
import { Input, Select, Pagination } from 'antd';
import UserTemplate from '../../components/template/user/UserTemplate';
import CardUjian from '../../components/template/user/CardUjian';

const { Search } = Input;
const { Option } = Select;

const dummyData = [
  { id: 1, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Selesai', totalQuestions: 60, completedQuestions: 60, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Matematika' },
  { id: 2, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Selesai', totalQuestions: 60, completedQuestions: 0, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Matematika' },
  { id: 3, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Sedang Berlangsung', totalQuestions: 60, completedQuestions: 30, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Matematika' },
  { id: 4, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Selesai', totalQuestions: 60, completedQuestions: 60, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Fisika' },
  { id: 5, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Belum Dimulai', totalQuestions: 60, completedQuestions: 0, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Kimia' },
  { id: 6, title: 'Pertidaksamaan Linear Dua Variabel', status: 'Sedang Berlangsung', totalQuestions: 60, completedQuestions: 30, date: '8 Agustus 2024', time: '08:30', mataPelajaran: 'Biologi' },
  // Tambahkan data dummy lainnya jika diperlukan
];

const KuisList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [mataPelajaranFilter, setMataPelajaranFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const itemsPerPage = 6;

  const filteredData = dummyData.filter((quiz) => {
    return (
      (statusFilter === 'Semua' || quiz.status === statusFilter) &&
      (mataPelajaranFilter === 'Semua' || quiz.mataPelajaran === mataPelajaranFilter) &&
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const updateCurrentData = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentData(filteredData.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateCurrentData(page);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    updateCurrentData(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateCurrentData(1);
  };

  const handleMataPelajaranChange = (value) => {
    setMataPelajaranFilter(value);
    setCurrentPage(1);
    updateCurrentData(1);
  };

  useEffect(() => {
    updateCurrentData(currentPage);
  }, [filteredData, currentPage]);

  return (
    <UserTemplate>
      <div className="p-1 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Kuis</h1>
          <div className="flex flex-row space-x-3 sm:flex-row sm:space-x-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full sm:w-auto"
              style={{ maxWidth: 180 }}
            >
              <Option value="Semua">Semua</Option>
              <Option value="Selesai">Selesai</Option>
              <Option value="Belum Dimulai">Belum Dimulai</Option>
              <Option value="Sedang Berlangsung">Sedang Berlangsung</Option>
            </Select>
            <Select
              value={mataPelajaranFilter}
              onChange={handleMataPelajaranChange}
              className="w-full sm:w-auto"
              style={{ maxWidth: 180 }}
            >
              <Option value="Semua">Semua</Option>
              <Option value="Matematika">Matematika</Option>
              <Option value="Fisika">Fisika</Option>
              <Option value="Kimia">Kimia</Option>
              <Option value="Biologi">Biologi</Option>
            </Select>
            <Search
              placeholder="Cari kuis..."
              onChange={handleSearchChange}
              className="w-full sm:w-auto mb-2 sm:mb-0"
              style={{ maxWidth: 250 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentData.map((quiz) => (
            <CardUjian key={quiz.id} quiz={quiz} />
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            position={["bottomCenter"]}
            size="small"
          />
        </div>
      </div>
    </UserTemplate>
  );
};

export default KuisList;





