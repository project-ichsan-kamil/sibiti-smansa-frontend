// apiConstants.js

// Base URL API untuk berbagai environment
const BASE_URL = {
    development: "http://localhost:3001/api",
    staging: "https://sibiti-smansa-prodlike.my.id",
    production: "https://sibiti-smansa.my.id",
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

  const GURU_API = {
    getListGuru: "/user-roles/list-guru",
    getListUnAssignUser: "/users/unassigned-verified-users",    //list akun yang tidak punya kelas,
    getSubject: "/subjects",
    createGuru: "/user-roles/create",
    deleteGuru: "/user-roles/guru"
  }

  const EXAM_API = {
    getSubjectBaseOnGuru: "/user-roles/guru-subjects",
    
    getListKuis: "/exam"
  }

  export { AUTH_API, CREATE_USER_API, CLASS_API, SUBJECT_API, ADMIN_API, GURU_API, EXAM_API, BASE_URL };
  