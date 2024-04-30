import supabase from "../Supabase";
import bcrypt from 'bcryptjs';

const login = async (email, password) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error) {
        console.log(error);
        throw new Error("Email belum terdaftar");
      }
  
      const { passwordMatch } = await verifyPassword(user, password);
  
      if (!passwordMatch) {
        throw new Error("Password salah");
      }
  
      const { data: role } = await getRoleUser(user.id);
  
      if (role !== "GURU" && role !== "ADMIN") {
        throw new Error("Akun anda tidak terdaftar sebagai guru maupun admin");
      }
  
      return { data: { user, role } };
    } catch (error) {
      console.error(error.message); // Log the error message for debugging
      return { error: error.message }; // Return the error message to the user
    }
  };

const getRoleUser = async (userId) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('userId', userId)
      .single();

    if (error) {
      throw new Error("Profile tidak di temukan");
    }

    return { data: profile.role };
  } catch (error) {
    return { error: error.message };
  }
};

const getUserByEmail = async (email) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error("Email belum terdaftar");
    }

    return { data: user };
  } catch (error) {
    return { error: error.message };
  }
};

const verifyPassword = async (user, password) => {
    const passwordMatch = await bcrypt.compare(password, user.password);
    return { passwordMatch };
};


const Auth = {
  login,
};

export default Auth;