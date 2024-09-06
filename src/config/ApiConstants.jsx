// apiConstants.js

// Base URL API untuk berbagai environment
const BASE_URL = {
    development: "http://localhost:3001/api",
    // staging: "https://api-staging.example.com",
    // production: "https://api.example.com",
  };
  
  // URL Helper untuk mendapatkan URL lengkap
  const getApiUrl = (endpoint) => {
    const env = process.env.NODE_ENV || "development"; // Mengambil environment saat ini
    return `${BASE_URL[env]}${endpoint}`;
  };
  
  // API untuk fitur autentikasi
  const AUTH_API = {
    login: getApiUrl("/auth/login"),
    register: getApiUrl("/auth/register"),
    logout: getApiUrl("/auth/logout"),
    authMe: getApiUrl("/auth/me")
  };
  
  // API untuk fitur pengguna (User)
  const USER_API = {
    getUser: getApiUrl("/user"),
    createUser: getApiUrl("/user/create"),
    updateUser: getApiUrl("/user/update"),
    deleteUser: getApiUrl("/user/delete"),
  };
  
  // API untuk fitur posting (Post)
  const POST_API = {
    getPosts: getApiUrl("/posts"),
    getPostById: (postId) => getApiUrl(`/posts/${postId}`),
    createPost: getApiUrl("/posts/create"),
    updatePost: (postId) => getApiUrl(`/posts/update/${postId}`),
    deletePost: (postId) => getApiUrl(`/posts/delete/${postId}`),
  };
  
  export { AUTH_API, USER_API, POST_API };
  