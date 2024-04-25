import {
  createBrowserRouter,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/home",
    element: <div>Hello world!</div>,
  },
  {
    path: "/",
    element: <div>Hello gais!</div>,
  },
]);

export default router;

