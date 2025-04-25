import React from 'react';

export default function Dashboard() {
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="card text-center" style={{ width: "50%", maxWidth: "800px" }}>
            {/* <img
            src="https://avatars.githubusercontent.com/u/150973246?v=4"
            className="card-img-top"
            alt="Banner"
            /> */}
            <div className="card-header">Dashboard</div>
            <div className="card-body">
            <h5 className="card-title">Selamat datang di halaman dashboard</h5>
            <p className="card-text">
                Dengan dukungan teks di bawah sebagai pengantar alami untuk konten tambahan.
            </p>
            </div>
        </div>
        </div>
    );
}