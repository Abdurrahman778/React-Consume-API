import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant.js";
import Modal from "../../components/Modal";
import Snackbar from "../../components/Snackbar";
import ConfirmationModal from "../../components/ConfirmationModal";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

export default function StuffIndex() {
  const [stuffs, setStuffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formModal, setFormModal] = useState({ id: null, name: "", type: "" });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
  });
  const [search, setSearch] = useState("");
  const [filteredStuffs, setFilteredStuffs] = useState([]);
  const [formInbound, setFormInbound] = useState({
    stuff_id: "",
    total: 0,
    proof_file: null,
  });
  const [isModalInboundOpen, setIsModalInboundOpen] = useState(false);

  const navigate = useNavigate();
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = stuffs.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStuffs(filtered);
  }, [search, stuffs]);

  async function fetchData() {
    try {
      const { data } = await axios.get(`${API_URL}/stuffs`, { headers });
      setStuffs(data.data);
    } catch (err) {
      handleError(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } =
        modalMode === "add"
          ? await axios.post(`${API_URL}/stuffs`, formModal, { headers })
          : await axios.patch(`${API_URL}/stuffs/${formModal.id}`, formModal, {
              headers,
              "Content-Type": "application/json",
            });

      setStuffs((prev) =>
        modalMode === "add"
          ? [...prev, data.data]
          : prev.map((item) => (item.id === formModal.id ? data.data : item))
      );

      showNotification(
        `Item "${formModal.name}" ${
          modalMode === "add" ? "added" : "updated"
        } successfully`,
        "success"
      );
      handleCloseModal();
    } catch (err) {
      handleError(err);
    }
  }

  async function confirmDelete() {
    try {
      await axios.delete(`${API_URL}/stuffs/${deleteConfirmation.itemId}`, {
        headers,
      });
      setStuffs((prev) =>
        prev.filter((item) => item.id !== deleteConfirmation.itemId)
      );
      showNotification(
        `Item "${deleteConfirmation.itemName}" deleted successfully`,
        "success"
      );
      setDeleteConfirmation({ isOpen: false, itemId: null, itemName: "" });
    } catch (err) {
      handleError(err);
    }
  }

  async function handleInboundSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("stuff_id", formInbound.stuff_id);
      formData.append("total", formInbound.total);
      formData.append("proof_file", formInbound.proof_file);

      await axios.post(`${API_URL}/inbound-stuffs`, formData, { headers });

      setIsModalInboundOpen(false);
      setFormInbound({ stuff_id: "", total: 0, proof_file: null });
      showNotification("Stock added successfully", "success");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  }

  function exportExcel() {
    const formattedData = stuffs.map((item, index) => ({
      // format data apa saja yang ada di data excel nya
      No: index + 1,
      Title : item.name,
      Type: item.type,
      TotalAvailable: item.stuff_stock ? 
      item.stuff_stock.total_available : 0,
      TotalDefec: item.stuff_stock ? 
      item.stuff_stock.total_defec : 0,
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

  function handleStockAction(id) {
    setFormInbound((prev) => ({ ...prev, stuff_id: id }));
    setIsModalInboundOpen(true);
  }

  const handleEdit = (item) => {
    setModalMode("edit");
    setFormModal({ id: item.id, name: item.name, type: item.type });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const item = stuffs.find((item) => item.id === id);
    setDeleteConfirmation({ isOpen: true, itemId: id, itemName: item.name });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormModal({ id: null, name: "", type: "" });
    setModalMode("add");
  };

  const showNotification = (message, type) =>
    setNotification({ message, type });

  const handleError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    showNotification(
      err.response?.data?.message || "An error occurred",
      "danger"
    );
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h3 className="card-title mb-0">Inventory Items</h3>
                <small className="text-muted">
                  Manage your inventory items
                </small>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                {/* Search Input */}
                {/* <div
                  className="input-group shadow-sm"
                  style={{ maxWidth: "400px" }}
                >
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div> */}

                <button
                  className="btn btn-primary shadow-sm"
                  onClick={() => {
                    setModalMode("add");
                    setIsModalOpen(true);
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Add New Item</span>
                </button>
                <button
                  className="btn btn-success shadow-sm"
                  onClick={() => {
                  exportExcel(true);
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Export Excel</span>
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th
                    scope="col"
                    rowSpan={2}
                    className="text-center"
                    width="5%"
                  >
                    #
                  </th>
                  <th scope="col" rowSpan={2} width="25%">
                    Item Name
                  </th>
                  <th scope="col" colSpan={2} className="text-center bg-light">
                    Stock Information
                  </th>
                  <th
                    scope="col"
                    rowSpan={2}
                    className="text-center"
                    width="25%"
                  >
                    Actions
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Available
                  </th>
                  <th scope="col" className="text-center">
                    Defective
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStuffs.length > 0 ? (
                  filteredStuffs.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.name}</td>
                      <td className="text-center">
                        <span className="badge bg-success">
                          {item.stuff_stock?.total_available || "0"}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            item.stuff_stock?.total_defec < 3
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {item.stuff_stock?.total_defec || "0"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleStockAction(item.id)}
                          >
                            <i className="bi bi-plus-circle me-1"></i>Stock
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <i className="bi bi-inbox fs-4 mb-2"></i>
                      <p className="text-muted mb-0">No items found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === "add" ? "Add New Item" : "Edit Item"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={formModal.name}
              onChange={(e) =>
                setFormModal((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group mt-3">
            <label className="form-label">
              Type <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={formModal.type}
              onChange={(e) =>
                setFormModal((prev) => ({ ...prev, type: e.target.value }))
              }
              required
            >
              <option value="">Select type</option>
              <option value="HTL/KLN">HTL/KLN</option>
              <option value="Lab">Lab</option>
              <option value="Sarpras">Sarpras</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              {modalMode === "add" ? "Add Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, itemId: null, itemName: "" })
        }
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteConfirmation.itemName}"? This action cannot be undone.`}
      />

      {/* Add Stock Modal */}
      <Modal
        isOpen={isModalInboundOpen}
        onClose={() => setIsModalInboundOpen(false)}
        title="Add Stock"
      >
        <form onSubmit={handleInboundSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">
              Total Items <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={formInbound.total}
              onChange={(e) =>
                setFormInbound((prev) => ({
                  ...prev,
                  total: parseInt(e.target.value),
                }))
              }
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">
              Proof Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setFormInbound((prev) => ({
                  ...prev,
                  proof_file: e.target.files[0],
                }))
              }
              required
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalInboundOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>
              Add Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* Notifications */}
      <Snackbar
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}
