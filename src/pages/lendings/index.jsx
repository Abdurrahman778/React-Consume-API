import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constant';
import Modal from '../../components/Modal';
import AlertSnackbar from '../../components/Snackbar';

export default function Lendings() {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState({});
    const [alert, setAlert] = useState({ message: '', severity: 'success' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        stuff_id: '',
        name: '',
        total_stuff: 0,
        note: '',
    });

    const navigate = useNavigate();
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    useEffect(() => {
        fetchLendings();
    }, []);

    function fetchLendings() {
        axios.get(`${API_URL}/stuffs`, { headers })
            .then((response) => {
                setStuffs(response.data.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                setError(error.response?.data || {});
            });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        axios.post(`${API_URL}/lendings`, formModal, { headers })
            .then((res) => {
                setIsModalOpen(false);
                setFormModal({ stuff_id: "", name: "", total_stuff: 0, note: "" });
                setAlert({
                    message: 'Successfully created new lending',
                    severity: 'success'
                });
                fetchLendings();
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                setError(err.response?.data || {});
            });
    }

    return (
        <>
            <AlertSnackbar
                alert={alert}
                errors={error}
                onClose={() => {
                    setAlert({ message: '', severity: 'success' });
                    setError({});
                }}
            />

            <div className="container mt-5">
                {/* Statistics Cards */}
                {/* <div className="row mb-4 g-3">
                    <div className="col-xl-3 col-sm-6">
                        <div className="card bg-gradient shadow-lg border-0">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                            <i className="bi bi-box fs-4 text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-muted">Available Items</h6>
                                            <h4 className="mb-0 fw-bold">
                                                {stuffs.filter(item => item.stuff_stock?.total_available > 0).length}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress bg-primary bg-opacity-10" style={{ height: "4px" }}>
                                    <div className="progress-bar bg-primary" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Main Content */}
                <div className="card border-0 shadow-lg">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0 fw-bold text-dark">Available Items for Lending</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            {stuffs.map((item, index) => (
                                <div className="col-md-4" key={item.id}>
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <div className="rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px" }}>

                                                <i className="bi bi-box-seam fs-4 text-primary"></i>
                                            </div>
                                            <h5 className="card-title mb-2">{item.name}</h5>
                                            <p className="card-text text-muted mb-3">
                                                Available Stock: 
                                                <span className="badge bg-success bg-opacity-10 text-success ms-2">
                                                    {item.stuff_stock?.total_available || 0}
                                                </span>
                                            </p>
                                            <button
                                                className={`btn ${item.stuff_stock?.total_available ? 'btn-primary' : 'btn-secondary'} w-100`}
                                                disabled={!item.stuff_stock?.total_available}
                                                onClick={() => {
                                                    setFormModal({ ...formModal, stuff_id: item.id });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                {item.stuff_stock?.total_available ? 'Borrow Item' : 'Not Available'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lending Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Lending"
            >
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Borrower Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter borrower name"
                            value={formModal.name}
                            onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter quantity"
                            min="1"
                            value={formModal.total_stuff}
                            onChange={(e) => setFormModal({ ...formModal, total_stuff: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Note
                        </label>
                        <textarea
                            className="form-control"
                            placeholder="Enter additional notes"
                            value={formModal.note}
                            onChange={(e) => setFormModal({ ...formModal, note: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit Lending
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}