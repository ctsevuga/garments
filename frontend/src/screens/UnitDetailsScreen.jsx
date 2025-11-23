import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useGetUnitByIdQuery } from "../slices/unitApiSlice";
import {
  FaIndustry,
  FaUserTie,
  FaUsers,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTshirt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

const UnitDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: unit, isLoading, error } = useGetUnitByIdQuery(id);

  return (
    <Container className="my-4">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </Button>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error?.data?.message || "Failed to load unit details"}
        </Alert>
      ) : (
        unit && (
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3 d-flex align-items-center">
              <FaIndustry className="me-2 fs-4" />
              <h4 className="mb-0">{unit.name}</h4>
            </Card.Header>

            <Card.Body className="bg-light">
              <Row className="gy-3">
                {/* Owner Section */}
                <Col md={6}>
                  <Card className="h-100 border-info border-2">
                    <Card.Header className="bg-info text-white fw-semibold">
                      <FaUserTie className="me-2" />
                      Owner
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Name:</strong> {unit.owner?.name}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaPhoneAlt className="me-2 text-success" />
                        {unit.owner?.phone || "—"}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>

                {/* Managers Section */}
                <Col md={6}>
                  <Card className="h-100 border-warning border-2">
                    <Card.Header className="bg-warning text-white fw-semibold">
                      <FaUsers className="me-2" />
                      Managers
                    </Card.Header>
                    <ListGroup variant="flush">
                      {unit.managers?.length > 0 ? (
                        unit.managers.map((manager) => (
                          <ListGroup.Item key={manager._id}>
                            <FaUserTie className="me-2 text-warning" />
                            {manager.name}{" "}
                            <span className="text-muted">
                              ({manager.phone || "—"})
                            </span>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item>No managers assigned</ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>
                </Col>

                {/* Address Section */}
                <Col md={6}>
                  <Card className="h-100 border-success border-2">
                    <Card.Header className="bg-success text-white fw-semibold">
                      <FaMapMarkerAlt className="me-2" />
                      Address
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        {unit.address?.address || "—"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {unit.address?.city} - {unit.address?.pincode}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaPhoneAlt className="me-2 text-success" />
                        {unit.address?.phoneNumber || "—"}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>

                {/* Capacity & Status */}
                <Col md={6}>
                  <Card className="h-100 border-primary border-2">
                    <Card.Header className="bg-primary text-white fw-semibold">
                      <FaTshirt className="me-2" />
                      Production Details
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Capacity:</strong> {unit.capacity} garments/day
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Status:</strong>{" "}
                        {unit.isActive ? (
                          <span className="text-success fw-semibold">
                            <FaCheckCircle className="me-1" />
                            Active
                          </span>
                        ) : (
                          <span className="text-danger fw-semibold">
                            <FaTimesCircle className="me-1" />
                            Inactive
                          </span>
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )
      )}
    </Container>
  );
};

export default UnitDetailsScreen;
