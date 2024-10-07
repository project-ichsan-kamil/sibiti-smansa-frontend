import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/auth/ErrorPage";
import Login from "./components/auth/Login";
import Dashboard from "./admin/dashboard/Dashboard";
import Kelas from "./admin/kelas/Kelas";
import Kuis from "./admin/ujian/kuis/Kuis";
import CreateUser from "./admin/create-user/CreateUser";
import ManagementAdmin from "./admin/management-role/ManagementAdmin";
import ManagementGuru from "./admin/management-role/ManagementGuru";
import MataPelajaran from "./admin/mata-pelajaran/MataPelajaran";
import PrivateRoute from "./components/auth/PrivateRoute";
import { Roles } from "./config/enum";
import NotAuthorizedPage from "./components/auth/NotAuthorizedPage ";
import FormExam from "./admin/ujian/FormExam";
import ChangePassword from "./user/change-password/ChangePassword";
import LoginUser from "./user/login/LoginUser";
import ForgotPassword from "./user/forgot-password/ForgotPassword";
import DashboardUser from "./user/dashboard/DashboardUser";
import Absensi from "./user/absensi/Absensi";
import SubmitSoal from "./admin/submit-soal/SubmitSoal";
import RiwayatAbsensi from "./user/riwayat-absen/RiwayatAbsensi";

const routes = [
  {
    path: "/",
    element: <LoginUser/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/change-password/:token",
    element: <ChangePassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: <DashboardUser />,
  },
  {
    path: "/absensi",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU, Roles.SISWA]}>
        <Absensi />
      </PrivateRoute>
    ),
  },
  {
    path: "/riwayat-absensi",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU, Roles.SISWA]}>
        <RiwayatAbsensi />
      </PrivateRoute>
    ),
  },
  
  {
    path: "/cms/dashboard",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/kelas",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN]}>
        <Kelas />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/kuis",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <Kuis />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/kuis/add",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <FormExam />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/kuis/edit/:id",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <FormExam/>
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/uh/add",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <FormExam />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/uts/add",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN]}>
        <FormExam />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/uas/add",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN]}>
        <FormExam />
      </PrivateRoute>
    ),
  },

  // submit soal
  {
    path: "/cms/submit-soal/:examId/:questionNumber",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <SubmitSoal/>
      </PrivateRoute>
    ),
  },

  
  //management user
  {
    path: "/cms/create-user",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN]}>
        <CreateUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/management-role/admin",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN]}>
        <ManagementAdmin />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/management-role/guru",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN]}>
        <ManagementGuru />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/mata-pelajaran",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN]}>
        <MataPelajaran />
      </PrivateRoute>
    ),
  },
  {
    path: "/not-authorized",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU, Roles.SISWA]}>
        <NotAuthorizedPage />
      </PrivateRoute>
    ),
    
  },
];

export default function AppRouter() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
