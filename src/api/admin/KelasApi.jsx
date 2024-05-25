import supabase from "../Supabase";

const add = async (nama, status, userId) => {
  try {
    const now = new Date().toISOString();
    const { data: username } = await getUsername(userId)

    const { data: resKelasByName } = await getKelasByName(nama)

    console.log(resKelasByName);

    if (resKelasByName.length > 0) {
      throw new Error("Kelas sudah terdaftar");
    }

    if (!username) {
      throw new Error("Username tidak ditemukan");
    }

    const kelas = {
      id: new Date().getTime(),
      nama: nama.toUpperCase(),
      status,
      statusData: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: username,
      updatedBy: username
    }

    const { data, error } = await supabase
      .from('kelas')
      .insert([kelas]);

    if (error) {
      throw new Error("Gagal menyimpan data kelas");
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
};

const update = async (id, status, userId) => {
  try {
    const now = new Date().toISOString();
    const { data: username } = await getUsername(userId);

    if (!username) {
      throw new Error("Username tidak ditemukan");
    }

    const kelas = {
      status,
      statusData: 1,
      updatedAt: now,
      updatedBy: username
    };

    const { data, error } = await supabase
      .from('kelas')
      .update(kelas)
      .eq('id', id);

    if (error) {
      throw new Error("Gagal mengupdate data kelas");
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
};

//TODO buatkan context current login
const getUsername = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data: user.username };
  } catch (error) {
    return { error: error.message };
  }
};

const getAllKelas = async () => {
  try {
    const { data, error } = await supabase
      .from('kelas')
      .select('*')
      .eq("statusData", 1)
      .order('updatedAt', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
};

const getKelasByName = async (nama) => {
  try {
    const { data, error } = await supabase
      .from('kelas')
      .select('*')
      .eq("nama", nama)
      .eq("statusData", 1)

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
};

const deleteKelas = async(id) => {
  try {
    const { data, error } = await supabase
      .from('kelas')
      .update({ "statusData": 2 })
      .eq('id', id)

    if (error) {
      throw new Error(error.message);
    }

    return { data: data };
  } catch (error) {
    return { error: error.message };
  }
}

const searchingKelas = async (nama) => {
  try {
    const { data, error } = await supabase
    .from('kelas')
    .select('*')
    .ilike('nama', `%${nama}%`)
    .eq('statusData', 1); 

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
};

const getKelasById = async (id) => {
  try {
    const { data, error } = await supabase
    .from('kelas')
    .select('*')
    .eq('id', id)
    .single()

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
}



const KelasService = {
  add,
  update,
  getAllKelas,
  deleteKelas,
  searchingKelas,
  getKelasById
};

export default KelasService;
