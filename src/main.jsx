import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./Router";
import { AuthProvider } from "./context/useContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
);
