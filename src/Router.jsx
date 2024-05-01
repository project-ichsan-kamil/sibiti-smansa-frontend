import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "./user/Home";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

export default router;

