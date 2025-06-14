import React from 'react'
import Navbar from '../components/Navbar' // Fix casing
import { Outlet } from 'react-router-dom'

export default function Template() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}