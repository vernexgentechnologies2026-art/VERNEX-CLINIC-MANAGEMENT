import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoute(){ return localStorage.getItem("vernex_auth")==="true" ? <Outlet/> : <Navigate to="/login" replace/>; }
