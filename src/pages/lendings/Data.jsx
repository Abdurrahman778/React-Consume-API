import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/Snackbar";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function LendingData() {
  const [lendings, setLendings] = useState([]);
  const [error, setError] = useState({});
  const [alert, setAlert] = useState({ message: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [formModal, setFormModal] = useState({
    lending_id: "",
    total_good_stuff: 0,
    total_defec_stuff: 0,
  });
  const [detailLending, setDetailLending] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredLendings, setFilteredLendings] = useState([]);
  const navigate = useNavigate();

  function fetchData() {
    setIsLoading(true);
    axios.get(`${API_URL}/lendings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then((response) => {
        setLendings(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError(error.response?.data || {});
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = lendings.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.stuff?.name || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLendings(filtered);
  }, [search, lendings]);

  function handleBtnCreate(lending) {
    setDetailLending(lending);
    setFormModal({ 
      ...formModal, 
      lending_id: lending.id,
      total_good_stuff: 0,
      total_defec_stuff: 0
    });
    setIsModalOpen(true);
  }

  function handleBtnDetail(lending) {
    setDetailLending(lending);
    setIsModalOpenDetail(true);
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    axios.post(`${API_URL}/restorations`, formModal, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then((res) => {
        setIsModalOpen(false);
        setFormModal({ lending_id: "", total_good_stuff: 0, total_defec_stuff: 0 });
        setDetailLending(null);
        setAlert({ message: "Successfully created restoration!", severity: "success" });
        fetchData();
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError(err.response?.data || {});
      });
  }

  const exportExcel = () => {
    const formatedData = lendings.map((value, index) => ({
      No: index + 1,
      Name: value.name,
      StuffName: value.stuff?.name || '-',
      TotalStuff: value.total_stuff || 0,
      Date: new Date(value.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      RestorationStatus: value.restoration ? "returned" : "-",
      RestorationTotalGoodStuff: value.restoration?.total_good_stuff || '-',
      RestorationTotalDefecStuff: value.restoration?.total_defec_stuff || '-',
      DateOfRestoration: value.restoration ? new Date(value.restoration.created_at)
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) : '-'
    }));

    const sheet = XLSX.utils.json_to_sheet(formatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Lendings Data");
    const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, "data_lendings.xlsx");
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertSnackbar
        alert={alert}
        errors={error}
        onClose={() => {
          setAlert({ message: "", severity: "success" });
          setError({});
        }}
      />

      <div className="container mt-5">
        {/* Main Content Card */}
        <div className="card border-0 shadow-lg">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark">Lending History</h5>
            <div className="d-flex align-items-center gap-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search lendings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={exportExcel}
              >
                <i className="bi bi-file-excel"></i>
                Export Excel
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4" rowSpan={2}>#</th>
                    <th className="py-3 px-4" rowSpan={2}>Name</th>
                    <th className="py-3 px-4 text-center" colSpan={2}>Stuff Details</th>
                    <th className="py-3 px-4" rowSpan={2}>Date</th>
                    <th className="py-3 px-4 text-center" rowSpan={2}>Actions</th>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 text-center">Name</th>
                    <th className="py-3 px-4 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLendings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No lending records found
                      </td>
                    </tr>
                  ) : (
                    filteredLendings.map((lending, index) => (
                      <tr key={lending.id}>
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 fw-semibold">{lending.name}</td>
                        <td className="py-3 px-4 text-center">{lending.stuff?.name || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                            {lending.total_stuff || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(lending.created_at).toLocaleDateString("id-ID", { 
                            dateStyle: "long" 
                          })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {lending.restoration ? (
                            <button
                              className="btn btn-outline-success btn-sm px-3 d-flex align-items-center gap-2"
                              onClick={() => handleBtnDetail(lending)}
                            >
                              <i className="bi bi-eye"></i>
                              View Details
                            </button>
                          ) : (
                            <button 
                              className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2"
                              onClick={() => handleBtnCreate(lending)}
                            >
                              <i className="bi bi-plus-circle"></i>
                              Create
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Restoration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Restoration"
      >
        <form onSubmit={handleSubmitForm}>
          <div className="alert alert-info">
            Lending <strong>{detailLending?.name}</strong> with total{" "}
            <strong>{detailLending?.total_stuff}</strong> items will be restored.
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Good Condition Items <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              value={formModal.total_good_stuff}
              onChange={(e) => setFormModal({ 
                ...formModal, 
                total_good_stuff: parseInt(e.target.value) 
              })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Defective Items <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              value={formModal.total_defec_stuff}
              onChange={(e) => setFormModal({ 
                ...formModal, 
                total_defec_stuff: parseInt(e.target.value) 
              })}
              required
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
            <button type="submit" className="btn btn-primary">
              Submit Restoration
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpenDetail}
        onClose={() => setIsModalOpenDetail(false)}
        title="Restoration Details"
      >
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-calendar-event me-2 text-primary"></i>
              Date of Restoration
            </span>
            <span className="badge bg-light text-dark">
              {new Date(detailLending?.restoration?.created_at).toLocaleDateString("id-ID", { 
                dateStyle: "long" 
              })}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-box me-2 text-primary"></i>
              Total Items Lent
            </span>
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {detailLending?.total_stuff || 0}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-check-circle me-2 text-success"></i>
              Items in Good Condition
            </span>
            <span className="badge bg-success bg-opacity-10 text-success">
              {detailLending?.restoration?.total_good_stuff || 0}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-x-circle me-2 text-danger"></i>
              Defective Items
            </span>
            <span className="badge bg-danger bg-opacity-10 text-danger">
              {detailLending?.restoration?.total_defec_stuff || 0}
            </span>
          </li>
        </ul>
      </Modal>
    </>
  );
}