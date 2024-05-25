import supabase from "../Supabase";

// Definisikan tipe untuk data kuis
interface Kuis {
  nama: string;
  type: string;
  mataPelajaranId: number;
  mulai: string;
  selesai: string;
  durasi: number;
  jumlahSoal: number;
  jumlahOpsi: number;
  typePeserta: string;
  peserta: string[];
  totalNilai: number;
  nilaiKkm: number;
  statusUjian: string;
  jumlahProgresSoal?: number;
  statusData?: number;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
}

interface MataPelajaran {
  id: number;
  nama: string;
}

interface Kelas {
  id: number;
  nama: string;
}

interface Siswa {
  id: number;
  userId: string;
  nama: string;
}

// Fungsi untuk menambahkan kuis ke database
const addKuis = async (kuis: Kuis): Promise<{ data?: any; error?: string }> => {
  try {
    const kuisData = {
      ...kuis,
      id: Date.now(), 
      jumlahProgresSoal: 0,
      statusData: 1,
      createdDate: new Date().toISOString(),
      createdBy: 'ichsanKamil',
      updatedDate: new Date().toISOString(),
      updatedBy: 'ichsanKamil',
    };

    //TODO buatkan context current user login    
    if (await isExistingKuis(kuis.nama)) {
      throw new Error("Judul kuis ini sudah terdaftar");
    }

    const { data, error } = await supabase
      .from('ujian')
      .insert([kuisData]);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Fungsi untuk mendapatkan semua mata pelajaran
const getAllMataPelajaran = async (): Promise<{ data?: MataPelajaran[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('mataPelajaran')
      .select('id, nama')
      .eq("statusData", 1)
      .order('nama', { ascending: true });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Fungsi untuk mendapatkan semua kelas
const getAllKelas = async (): Promise<{ data?: Kelas[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('kelas')
      .select('id, nama')
      .eq("statusData", 1)
      .order('nama', { ascending: true });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Fungsi untuk mendapatkan semua siswa
const getAllSiswa = async (): Promise<{ data?: Siswa[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, userId, nama')
      .eq("statusData", 1)
      .eq("role", "SISWA")
      .order('nama', { ascending: true });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

const getAllKuis = async (): Promise<{data?: Kuis[]; error?: string}> => {
  try {
    const { data, error } = await supabase
      .from('ujian')
      .select('*')
      .eq('statusData', 1)
      .order('updatedDate', { ascending: false });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}


const isExistingKuis = async (nama: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('ujian')
      .select('id')
      .eq('nama', nama);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return data && data.length > 0;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
}


const KuisService = {
  getAllMataPelajaran,
  getAllSiswa,
  getAllKelas,
  addKuis,
  getAllKuis
};

export default KuisService;

