import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "./user/Home";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";
import CmsTemplate from "./components/CmsTemplate";
import Dashboard from "./admin/dashboard/Dashboard";

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
 
]);

export default router;

