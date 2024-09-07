// apiConstants.js

// Base URL API untuk berbagai environment
const BASE_URL = {
    development: "http://localhost:3001/api",
    // staging: "https://api-staging.example.com",
    // production: "https://api.example.com",
  };
  
  
  // API untuk fitur autentikasi
  const AUTH_API = {
    login: "/auth/login",
    register:"/auth/register",
    logout:"/auth/logout",
    authMe:"/auth/me"
  };
  
  // API untuk fitur pengguna (User)
  const CREATE_USER_API = {
    createUser: "/users/create",
    deleteUser: "/users/delete",
    approveUser: "/users/verify",
    searchUser: "/users/search",
    getUnVerifiedUser: "users/user-unverified",
    uploadTemplateExcel : "/users/upload-excel",
    downloadTemplateExcel: "/excel/generate-template-create-user",
    getClass : "/classes"
  };
  
  const CLASS_API = {
    fetchClass : "/classes"
  }

  const SUBJECT_API = {
    fetchSubject: "/subjects"
  }

  const ADMIN_API = {
    fetchAdmin: "/user-roles/list-admins",
    getListGuru: "/user-roles/list-guru",
    createAdmin: "/user-roles/create",
    deleteAdmin: "/user-roles/admin"
  }

  export { AUTH_API, CREATE_USER_API, CLASS_API, SUBJECT_API, ADMIN_API, BASE_URL };
  