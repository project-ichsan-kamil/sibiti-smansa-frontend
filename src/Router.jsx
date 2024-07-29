import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "./user/Home";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/auth/Login";
import Dashboard from "./admin/dashboard/Dashboard";
import Kelas from "./admin/kelas/Kelas";
import Kuis from "./admin/ujian/kuis/Kuis";
import FormKuis from "./admin/ujian/kuis/FormKuis";
import CreateUser from "./admin/create-user/CreateUser";
import ManagementAdmin from "./admin/management-role/ManagementAdmin";
import ManagementGuru from "./admin/management-role/ManagementGuru";
import MataPelajaran from "./admin/mata-pelajaran/MataPelajaran";
import RequireAuth from "./components/auth/RequireAuth";

const router = createBrowserRouter([
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
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/kelas",
    element: (
      <RequireAuth>
        <Kelas />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/kuis",
    element: (
      <RequireAuth>
        <Kuis />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/kuis/add",
    element: (
      <RequireAuth>
        <FormKuis />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/kuis/edit/:id",
    element: (
      <RequireAuth>
        <FormKuis />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/tambah-user",
    element: (
      <RequireAuth>
        <CreateUser />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/management-role/admin",
    element: (
      <RequireAuth>
        <ManagementAdmin />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/management-role/guru",
    element: (
      <RequireAuth>
        <ManagementGuru />
      </RequireAuth>
    ),
  },
  {
    path: "/cms/mata-pelajaran",
    element: (
      <RequireAuth>
        <MataPelajaran />
      </RequireAuth>
    ),
  },
]);

export default router;


