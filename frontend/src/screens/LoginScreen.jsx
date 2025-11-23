import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import {
  FaIndustry,
  FaSitemap,
  FaTshirt,
  FaTruck,
  FaClipboardCheck,
  FaCogs,
} from "react-icons/fa";
import Garments from "../assets/Garments.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/Home";

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      return toast.error("Please enter a valid 10-digit Indian phone number");
    }

    try {
      const res = await login({ phone, password }).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  return (
    <div>
      {/* ========================= LOGIN SECTION ========================= */}
      <Container
        fluid
        className="py-3"
        style={{
          background: "linear-gradient(135deg, tomato 0%, #ff7043 100%)",
          minHeight: "80vh",
        }}
      >
        <Row className="align-items-center justify-content-center">
          {/* LEFT SIDE - LOGIN FORM */}
          <Col xs={12} md={6} className="px-4 mb-4 mb-md-0" style={{ zIndex: 2 }}>
            <Card
              className="shadow-lg border-0"
              style={{
                backgroundColor: "#ffffffdd",
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Body className="p-4">
                <h2
                  className="text-center mb-4 fw-bold"
                  style={{ color: "tomato" }}
                >
                  Welcome to Garments Portal 👗
                </h2>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label className="fw-semibold">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-danger"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 fw-bold"
                    disabled={isLoading}
                    style={{
                      backgroundColor: "tomato",
                      borderColor: "tomato",
                    }}
                  >
                    {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
                  </Button>

                  <div className="text-center mt-3">
                    <p>
                      New User?{" "}
                      <a href="/register" className="text-danger fw-semibold">
                        Register
                      </a>
                    </p>
                    <p>
                      <a href="/forgot-password" className="text-danger fw-semibold">
                        Forgot Password?
                      </a>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SIDE - IMAGE */}
          <Col
            xs={12}
            md={6}
            className="d-flex justify-content-center align-items-center mt-3"
            style={{ marginBottom: "2rem" }}
          >
            <img
              src={Garments}
              alt="Textile and Garments"
              className="img-fluid rounded shadow-lg"
              style={{
                maxHeight: "420px",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
          </Col>
        </Row>
      </Container>

      {/* ========================= GARMENT MANAGEMENT INFO ========================= */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: "tomato" }}>
            Textile & Garment Production Workflow
          </h1>
          <p className="fs-5" style={{ color: "#444" }}>
            Streamline every step of your production — from managing units and inventory
            to processing orders and tracking each production stage with precision and efficiency.
          </p>
        </div>

        {/* Section 1: What is the Production Workflow */}
        <div className="row align-items-center mb-5">
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <img
              src="https://images.unsplash.com/photo-1582719471137-c3967ffb1c9a?auto=format&fit=crop&w=900&q=80"
              alt="Garment Production Workflow"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-12 col-md-6">
            <h3 className="fw-bold mb-3" style={{ color: "#e74c3c" }}>
              What is the Garment Production Workflow?
            </h3>
            <p style={{ color: "#4b5563" }}>
              The production workflow in garments manufacturing involves a series of well-defined stages —
              from raw fabric sourcing and cutting to stitching, finishing, and packaging.
            </p>
            <p style={{ color: "#4b5563" }}>
              A digital production management system ensures every step is optimized for quality,
              time efficiency, and resource utilization.
            </p>
          </div>
        </div>

        {/* Section 2: Key Departments */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3 text-center" style={{ color: "#ff7043" }}>
            Key Areas in Garment Management
          </h3>
          <p className="text-center mx-auto" style={{ maxWidth: "750px", color: "#4b5563" }}>
            Effective coordination across departments ensures seamless production and delivery of quality garments.
          </p>

          <div className="row mt-4">
            {[
              "Fabric and Material Procurement",
              "Cutting and Stitching Units",
              "Quality Control and Inspection",
              "Inventory and Warehouse Management",
              "Order Processing and Delivery Tracking",
              "Production Stage Monitoring and Workflow Automation",
            ].map((item, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 mb-3">
                <div
                  className="card shadow-sm h-100 border-0"
                  style={{ borderLeft: "5px solid tomato" }}
                >
                  <div className="card-body d-flex align-items-start">
                    <FaClipboardCheck
                      size={24}
                      color="tomato"
                      className="me-2 mt-1 flex-shrink-0"
                    />
                    <p className="mb-0" style={{ color: "#374151" }}>
                      {item}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Benefits */}
        <div>
          <h3 className="fw-bold mb-3 text-center" style={{ color: "tomato" }}>
            Benefits of Digital Textile & Garment Management
          </h3>
          <div className="row mt-4">
            {[
              {
                title: "Optimized Workflow",
                desc: "Digitize and monitor each stage — from design to dispatch — ensuring efficiency.",
                icon: <FaCogs size={28} color="tomato" className="mb-3" />,
              },
              {
                title: "Inventory Accuracy",
                desc: "Real-time stock tracking minimizes wastage and improves order fulfillment.",
                icon: <FaIndustry size={28} color="#ff7043" className="mb-3" />,
              },
              {
                title: "Better Quality Control",
                desc: "Detect issues early with integrated inspection checkpoints.",
                icon: <FaClipboardCheck size={28} color="#e74c3c" className="mb-3" />,
              },
              {
                title: "On-Time Order Delivery",
                desc: "Track orders and production in real time for better delivery planning.",
                icon: <FaTruck size={28} color="#d32f2f" className="mb-3" />,
              },
              {
                title: "Unit-Level Insights",
                desc: "Monitor performance across multiple production units or departments.",
                icon: <FaSitemap size={28} color="#b71c1c" className="mb-3" />,
              },
              {
                title: "Product Lifecycle Management",
                desc: "Track product history — from raw fabric to finished garment.",
                icon: <FaTshirt size={28} color="#ff5722" className="mb-3" />,
              },
            ].map((benefit, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 shadow-sm border-0 text-center p-3"
                  style={{ borderTop: "5px solid tomato" }}
                >
                  {benefit.icon}
                  <h5 className="card-title fw-bold" style={{ color: "tomato" }}>
                    {benefit.title}
                  </h5>
                  <p className="card-text" style={{ color: "#4b5563" }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Section */}
        <div className="text-center mt-5">
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            A digital textile and garments management system empowers factories and units to stay organized,
            reduce waste, and deliver quality apparel faster — uniting craftsmanship with smart technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
