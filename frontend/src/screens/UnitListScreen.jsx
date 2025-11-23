import React from "react";
import { Table, Button, Spinner, Alert, Container } from "react-bootstrap";
import { useGetUnitsQuery, useDeleteUnitMutation } from "../slices/unitApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt, FaIndustry } from "react-icons/fa";

const UnitListScreen = () => {
  const navigate = useNavigate();

  // ✅ Fetch units from RTK Query
  
  const { data: units, isLoading, error, refetch } = useGetUnitsQuery();

  // ✅ Delete mutation
  const [deleteUnit, { isLoading: loadingDelete }] = useDeleteUnitMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await deleteUnit(id).unwrap();
        refetch();
        alert("Unit deleted successfully!");
      } catch (err) {
        alert(err?.data?.message || "Failed to delete unit");
      }
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-primary">
          <FaIndustry className="me-2 text-info" />
          Production Units
        </h2>
        <Button variant="success" onClick={() => navigate("/units/create")}>
          + Add Unit
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error?.data?.message || "Failed to load units"}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="table-sm align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Managers</th>
                <th>Address</th>
                <th>Capacity</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units?.map((unit, index) => (
                <tr key={unit._id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold text-dark">{unit.name}</td>
                  <td>{unit.owner?.name || "—"}</td>
                  <td>
                    {unit.managers?.length > 0
                      ? unit.managers.map((m) => m.name).join(", ")
                      : "—"}
                  </td>
                  <td>
                    {unit.address?.address}, {unit.address?.city} <br />
                    <small className="text-muted">
                      {unit.address?.phoneNumber}
                    </small>
                  </td>
                  <td>{unit.capacity}</td>
                  <td>
                    {unit.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2 text-white"
                      onClick={() => navigate(`/units/${unit._id}`)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2 text-white"
                      onClick={() => navigate(`/units/edit/${unit._id}`)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={loadingDelete}
                      onClick={() => deleteHandler(unit._id)}
                    >
                      {loadingDelete ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        <FaTrashAlt />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default UnitListScreen;
