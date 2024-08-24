import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./user/Home";
import ErrorPage from "./components/auth/ErrorPage";
import Login from "./components/auth/Login";
import Dashboard from "./admin/dashboard/Dashboard";
import Kelas from "./admin/kelas/Kelas";
import Kuis from "./admin/ujian/kuis/Kuis";
import FormKuis from "./admin/ujian/kuis/FormKuis";
import CreateUser from "./admin/create-user/CreateUser";
import ManagementAdmin from "./admin/management-role/ManagementAdmin";
import ManagementGuru from "./admin/management-role/ManagementGuru";
import MataPelajaran from "./admin/mata-pelajaran/MataPelajaran";
import PrivateRoute from "./components/auth/PrivateRoute";
import { Roles } from "./config/enum";
import NotAuthorizedPage from "./components/auth/NotAuthorizedPage ";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cms/dashboard",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN]}>
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
        <FormKuis />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/kuis/edit/:id",
    element: (
      <PrivateRoute allowedRoles={[Roles.SUPER_ADMIN, Roles.ADMIN, Roles.GURU]}>
        <FormKuis />
      </PrivateRoute>
    ),
  },
  {
    path: "/cms/tambah-user",
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
    element: <NotAuthorizedPage />,
  },
];

export default function AppRouter() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
