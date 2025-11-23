import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaWarehouse,
  FaUsers,
  FaCity,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaTshirt,
} from "react-icons/fa";
import { useCreateUnitMutation } from "../slices/unitApiSlice";
import { useGetUnitManagersQuery } from "../slices/usersApiSlice";
import { useSelector } from "react-redux";

const CreateUnitForm = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // 🔹 Local state
  const [formData, setFormData] = useState({
    name: "",
    managers: [],
    address: {
      address: "",
      city: "",
      pincode: "",
      phoneNumber: "",
    },
    capacity: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 RTK Query hooks
  const [createUnit, { isLoading }] = useCreateUnitMutation();
  const { data: managersList = [], isLoading: managersLoading, error: managersError } =
    useGetUnitManagersQuery();

  // 🔹 Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "pincode", "phoneNumber"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleManagerSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, managers: selectedOptions }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await createUnit({
        ...formData,
        owner: userInfo._id, // auto-assign owner
      }).unwrap();

      setSuccessMsg(`✅ Unit "${res.name}" created successfully!`);
      setFormData({
        name: "",
        managers: [],
        address: { address: "", city: "", pincode: "", phoneNumber: "" },
        capacity: "",
      });
    } catch (error) {
      setErrorMsg(error?.data?.message || "Failed to create unit");
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-lg border-0">
            <Card.Header
              className="text-center text-white"
              style={{ background: "linear-gradient(90deg, #007bff, #6610f2)" }}
            >
              <h4 className="mb-0 d-flex align-items-center justify-content-center gap-2">
                <FaWarehouse /> Create New Unit
              </h4>
            </Card.Header>

            <Card.Body style={{ backgroundColor: "#f9f9f9" }}>
              {successMsg && <Alert variant="success">{successMsg}</Alert>}
              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

              <Form onSubmit={submitHandler}>
                {/* Unit Name */}
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Unit Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaTshirt color="#007bff" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter unit name"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Managers Dropdown */}
                <Form.Group className="mb-3" controlId="managers">
                  <Form.Label>Assign Manager(s)</Form.Label>
                  {managersLoading ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" /> Loading managers...
                    </div>
                  ) : managersError ? (
                    <Alert variant="danger">Failed to load managers</Alert>
                  ) : (
                    <InputGroup>
                      <InputGroup.Text>
                        <FaUsers color="#17a2b8" />
                      </InputGroup.Text>
                      <Form.Select
                        multiple
                        name="managers"
                        value={formData.managers}
                        onChange={handleManagerSelect}
                        style={{ minHeight: "120px" }}
                      >
                        {managersList.map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.name} ({manager.email})
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  )}
                  <Form.Text className="text-muted">
                    Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select multiple managers.
                  </Form.Text>
                </Form.Group>

                {/* Address & City */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaMapMarkedAlt color="#ffc107" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address.address}
                          onChange={handleChange}
                          placeholder="Street address"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaCity color="#6f42c1" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.address.city}
                          onChange={handleChange}
                          placeholder="City name"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Pincode & Phone */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="pincode">
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phoneNumber">
                      <Form.Label>Phone Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaPhoneAlt color="#dc3545" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={formData.address.phoneNumber}
                          onChange={handleChange}
                          placeholder="Contact number"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Capacity */}
                <Form.Group className="mb-3" controlId="capacity">
                  <Form.Label>Daily Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 500 garments"
                  />
                </Form.Group>

                {/* Owner info (auto-assigned) */}
                <Alert variant="info" className="py-2">
                  👤 <strong>Owner:</strong> {userInfo?.name} ({userInfo?.email})
                </Alert>

                {/* Submit */}
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    className="px-5 py-2 fw-bold"
                    disabled={isLoading}
                    style={{
                      background: "linear-gradient(90deg, #007bff, #6610f2)",
                      border: "none",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Creating...
                      </>
                    ) : (
                      "Create Unit"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUnitForm;
