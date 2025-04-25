import React from 'react'
import Navbar from '../components/Navbar'
// import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'

export default function Template() {
    return (
        <>
            <Navbar></Navbar>
            <div className="container">
                <Outlet/>
            </div>
        </>
    )
}