import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/Snackbar";

// Custom hook for auth handling
const useAuth = () => {
  const navigate = useNavigate();
  const handleUnauthorized = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return { handleUnauthorized };
};

export default function InboundIndex() {
  const [inbounds, setInbounds] = useState([]);
  const [state, setState] = useState({
    alert: "",
    isLoaded: false,
    error: null,
  });
  const { handleUnauthorized } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    inboundId: null,
    stuffName: "",
  });

  const fetchInbound = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    axios
      .get(`${API_URL}/inbound-stuffs`, { headers })
      .then((res) => {
        setInbounds(res.data.data);
        setState((prev) => ({ ...prev, isLoaded: true }));
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleUnauthorized();
        } else {
          setState((prev) => ({
            ...prev,
            error: err.response?.data || { message: "Failed to fetch data." },
          }));
        }
      });
  };

  function exportExcel() {
      const formattedData = stuff.map((item, index) => ({
        // format data apa saja yang ada di data excel nya
        No: index + 1,
        StuffName: item.name,
        Total: item.total,
        // TotalAvailable: item.stuff_stock ? 
        // item.stuff_stock.total_available : 0,
        // TotalDefec: item.stuff_stock ? 
        // item.stuff_stock.total_defec : 0,
        ProofFile: item.proof_file,
        Date: new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(new Date(item.created_at))
      }));
  
      // ubah array of object jadi worsheet excel
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      // simpan file dengan ekstensi pada type
      const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      // unduh dengan nama file
      saveAs(file, "Stuffs.xlsx");
    }

  useEffect(() => {
    fetchInbound();
  }, []);

  const handleDelete = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    axios
      .delete(`${API_URL}/inbound-stuffs/${deleteModal.inboundId}`, { headers })
      .then((res) => {
        setState((prev) => ({
          ...prev,
          alert: "Successfully deleted inbound",
          error: null,
        }));
        fetchInbound();
        setDeleteModal({ isOpen: false, inboundId: null, stuffName: "" });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleUnauthorized();
        } else {
          setState((prev) => ({
            ...prev,
            error: err.response?.data || {
              message: "Failed to delete inbound.",
            },
          }));
        }
      });
  };

  return (
    <>
      <AlertSnackbar
        alert={{ message: state.alert, severity: "success" }}
        errors={state.error}
        onClose={() =>
          setState((prev) => ({ ...prev, alert: "", error: null }))
        }
      />

      <div className="container mt-5">
        {/* Main Content Card */}
        <div className="card border-0 shadow-lg">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark">Inbound History</h5>
            <button className="btn btn-success" 
              onClick={() => {
              exportExcel(true);
              }}
            > Export Excel</button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Added Stock</th>
                    <th className="py-3 px-4">Proof Image</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inbounds.length > 0 ? (
                    inbounds.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 fw-semibold">
                          {item.stuff.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                            {item.total}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={item.proof_file}
                            alt="Proof"
                            style={{ height: "60px", cursor: "pointer" }}
                            onClick={() => {
                              setModalOpen(true);
                              setSelectedImage(item.proof_file);
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  inboundId: item.id,
                                  stuffName: item.stuff.name,
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No inbound records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Image Preview"
      >
        <div className="text-center">
          <img
            src={selectedImage}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "500px" }}
            className="rounded"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        title="Delete Confirmation"
      >
        <div className="modal-body">
          <div className="text-center mb-4">
            <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
            <h5 className="mt-2">Delete Confirmation</h5>
            <p className="text-muted">
              Are you sure you want to delete this inbound record for:
              <br />
              <strong>{deleteModal.stuffName}</strong>?
            </p>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-light px-4"
              onClick={() =>
                setDeleteModal((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </button>
            <button className="btn btn-danger px-4" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
