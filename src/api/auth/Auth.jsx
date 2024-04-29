// import supabase from "../Supabase";

// const Auth = {
//     login: async (email, password) => {
//         const { data, error } = await supabase
//             .from('users')
//             .select('*')
//             .eq('email', email)
//             .single();
        
//         if (error) {
//             return { error: "user tidak ditemukan" };
//         }

//         return { data };
//     }
// };

// export default Auth;

import supabase from "../Supabase";
import bcrypt from 'bcryptjs';

const Auth = {
    login: async (email, password) => {
        console.log(typeof email);
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) {
                console.log(error);
                throw new Error("User not found");
            }

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log(passwordMatch);
            if (!passwordMatch) {
                throw new Error("Password salah");
            }

            // Password is correct, return user data
            return { data: user };
        } catch (error) {
            return { error: error.message };
        }
    }
};

export default Auth;


