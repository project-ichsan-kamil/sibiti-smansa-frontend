import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "./user/Home";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";
import CmsTemplate from "./components/CmsTemplate";
import Dashboard from "./admin/dashboard/Dashboard";
import Kelas from "./admin/kelas/Kelas";
import Kuis from "./admin/ujian/kuis/Kuis";
import FormKuis from "./admin/ujian/kuis/FormKuis";

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
    element: <Dashboard/>,
  },
  {
    path: "/cms/kelas",
    element: <Kelas/>,
  },
  {
    path: "/cms/kuis",
    element: <Kuis/>,
  },
  {
    path: "/cms/kuis/add",
    element: <FormKuis/>,
  },
]);

export default router;

