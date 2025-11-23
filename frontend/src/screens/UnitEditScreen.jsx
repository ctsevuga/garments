import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";

import {
  FaIndustry,
  FaUserTie,
  FaUsers,
  FaMapMarkerAlt,
  FaTshirt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";

import { useSelector } from "react-redux";

import {
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
} from "../slices/unitApiSlice";

import {
  useGetUnitManagersQuery,
  useGetClientsQuery,
} from "../slices/usersApiSlice";

const UnitEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const userRole = userInfo?.role;

  // ------------------ API CALLS ------------------
  const { data: unit, isLoading, error } = useGetUnitByIdQuery(id);

  const {
    data: managersList,
    isLoading: loadingManagers,
  } = useGetUnitManagersQuery(undefined, {
    skip: userRole !== "admin",
  });

  const {
    data: clientsList,
    isLoading: loadingClients,
  } = useGetClientsQuery(undefined, {
    skip: userRole !== "admin",
  });

  console.log(clientsList);

  const [updateUnit, { isLoading: loadingUpdate }] = useUpdateUnitMutation();

  // ------------------ LOCAL STATE ------------------
  const [name, setName] = useState("");

  // Owner (ID for backend)
  const [owner, setOwner] = useState("");
  const [ownerName, setOwnerName] = useState(""); // UI for non-admin

  const [selectedManagers, setSelectedManagers] = useState([]);
  const [managerNames, setManagerNames] = useState("");

  const [address, setAddress] = useState({
    address: "",
    city: "",
    pincode: "",
    phoneNumber: "",
  });

  const [capacity, setCapacity] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // ------------------ POPULATE DATA ------------------
  useEffect(() => {
    if (unit) {
      setName(unit.name);

      setOwner(unit.owner?._id || "");
      setOwnerName(unit.owner?.name || "");

      setSelectedManagers(unit.managers?.map((m) => m._id) || []);
      setManagerNames(unit.managers?.map((m) => m.name).join(", ") || "");

      setAddress(unit.address || {});
      setCapacity(unit.capacity);
      setIsActive(unit.isActive);
    }
  }, [unit]);

  // ------------------ SUBMIT ------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUnit({
        id,
        name,
        owner,
        managers: selectedManagers,
        address,
        capacity,
        isActive,
      }).unwrap();

      alert("✅ Unit updated successfully!");
      navigate("/units");
    } catch (err) {
      alert(err?.data?.message || "❌ Failed to update unit");
    }
  };

  // ------------------ UI ------------------
  return (
    <Container className="my-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </Button>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error?.data?.message || "Failed to load unit details"}
        </Alert>
      ) : (
        unit && (
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <FaIndustry className="me-2 fs-4" />
              <h4 className="mb-0">Edit Unit – {unit.name}</h4>
            </Card.Header>

            <Card.Body className="bg-light">
              <Form onSubmit={submitHandler}>
                <Row className="gy-4">

                  {/* UNIT NAME */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-primary">
                        <FaIndustry className="me-2" /> Unit Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* OWNER */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-info">
                        <FaUserTie className="me-2" /> Owner
                      </Form.Label>

                      {userRole === "admin" ? (
                        loadingClients ? (
                          <Spinner animation="border" />
                        ) : (
                          <Form.Control
                            as="select"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                          >
                            <option value="">-- Select Client --</option>
                            {clientsList?.data?.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.name}
                              </option>
                            ))}
                          </Form.Control>
                        )
                      ) : (
                        <Form.Control type="text" value={ownerName} disabled />
                      )}
                    </Form.Group>
                  </Col>

                  {/* MANAGER MULTI-SELECT */}
                  <Col md={12}>
                    <Form.Group controlId="managers">
                      <Form.Label className="fw-semibold text-warning">
                        <FaUsers className="me-2" /> Managers
                      </Form.Label>

                      {userRole === "admin" ? (
                        loadingManagers ? (
                          <Spinner animation="border" />
                        ) : (
                          <Form.Control
                            as="select"
                            multiple
                            value={selectedManagers}
                            onChange={(e) => {
                              const values = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              );
                              setSelectedManagers(values);
                            }}
                            style={{ height: "160px" }}
                          >
                            {managersList?.map((mgr) => (
                              <option key={mgr._id} value={mgr._id}>
                                {mgr.name}
                              </option>
                            ))}
                          </Form.Control>
                        )
                      ) : (
                        <Form.Control type="text" value={managerNames} disabled />
                      )}
                    </Form.Group>
                  </Col>

                  {/* ADDRESS */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-success">
                        <FaMapMarkerAlt className="me-2" /> Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={address.address || ""}
                        onChange={(e) =>
                          setAddress({ ...address, address: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        value={address.city || ""}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        value={address.pincode || ""}
                        onChange={(e) =>
                          setAddress({ ...address, pincode: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>

                  {/* PHONE NUMBER */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        <FaCheckCircle className="me-2 text-success" /> Contact
                        Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={address.phoneNumber || ""}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>

                  {/* CAPACITY */}
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-primary">
                        <FaTshirt className="me-2" /> Capacity (per day)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* ACTIVE */}
                  <Col md={3} className="d-flex align-items-center mt-4">
                    <Form.Check
                      type="switch"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      label={
                        isActive ? (
                          <span className="text-success fw-semibold">
                            <FaCheckCircle className="me-1" /> Active
                          </span>
                        ) : (
                          <span className="text-danger fw-semibold">
                            <FaTimesCircle className="me-1" /> Inactive
                          </span>
                        )
                      }
                    />
                  </Col>

                  {/* SUBMIT BUTTON */}
                  <Col xs={12} className="text-center mt-4">
                    <Button variant="success" type="submit" disabled={loadingUpdate}>
                      {loadingUpdate ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" /> Update Unit
                        </>
                      )}
                    </Button>
                  </Col>

                </Row>
              </Form>
            </Card.Body>
          </Card>
        )
      )}
    </Container>
  );
};

export default UnitEditScreen;
