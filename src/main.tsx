import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";
createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><AppRoutes/><Toaster richColors position="top-right"/></BrowserRouter></StrictMode>);
