import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminPage() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        user.role == "admin" ? <Outlet /> : <Navigate to="/login" replace />
        
    )
}