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
    const { data : kuisData, error } = await supabase
      .from('ujian')
      .select('*')
      .eq('statusData', 1)
      .order('updatedDate', { ascending: false });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    if (kuisData) {
      for (const kuis of kuisData) {
        kuis.peserta = convertToArray(kuis.peserta);
        if (kuis.typePeserta === 1 && kuis.peserta) {
          const { data: kelasData, error: kelasError } = await supabase
            .from('kelas')
            .select('id, nama')
            .in('id', kuis.peserta)
            .order("nama",  { ascending: true });
            
          if (kelasError) {
            console.log(kelasError);
            throw new Error(kelasError.message);
          }

          kuis.peserta = kelasData.map((kelas: Kelas) => kelas.nama);
        } else if (kuis.typePeserta === 2 && kuis.peserta) {          
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, userId, nama')
            .in('userId', kuis.peserta);

          if (userError) {
            console.log(userError);
            throw new Error(userError.message);
          }

          console.log(userData);
          

          kuis.peserta = userData.map((user: Siswa) => user.nama);
        }
      }
    }

    return { data : kuisData };
  } catch (error: any) {
    return { error: error.message };
  }
}

const deleteKuis = async (id: any): Promise<{ data?: boolean; error?: string }> => {  //TODO check dlu apakah ini sudah ada yang ujian
  try {
    const { data , error } = await supabase
      .from('ujian')
      .update({ statusData: 2 })
      .eq('id', id);

    if (error) {
      console.error('Error updating quiz status:', error);
      throw new Error(error.message);
    }

    return { data: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

const getKuisById = async (id : any): Promise<{ data?: Siswa[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('ujian')
      .select('*')
      .eq("id", id)
      .single();

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
      .eq('statusData', 1)
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

const convertToArray = (input: string): number[] => {
  const cleanedString = input.replace(/[\[\]]/g, '');
  const array = cleanedString.split(',');
  const numberArray = array.map(item => Number(item.trim()));
  return numberArray;
};


const KuisService = {
  getAllMataPelajaran,
  getAllSiswa,
  getAllKelas,
  addKuis,
  getAllKuis,
  deleteKuis,
  getKuisById
};

export default KuisService;

