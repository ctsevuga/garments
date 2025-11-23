import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

import {
  Container,
  Row,
  Col,
  Card
} from "react-bootstrap";

import {
  FaBox,
  FaList,
  FaTags,
  FaShoppingCart,
  FaWarehouse,
  FaPlusCircle,
  FaTruck,
  FaClipboardCheck,
  FaUserCog,
  FaBell,
  FaSignOutAlt,
  FaCubes,
  FaChartBar,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";

import Nutrition from "../assets/NutritionLogo.png";
import "../css/HomeScreen.css";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;

  // -------------------------
  // ROLE → NAVIGATION BUTTONS
  // -------------------------
  const roleNavigation = {
    admin: [
      { title: "Product List", path: "/productList", icon: <FaBox /> },
      { title: "Product Category", path: "/productCategory", icon: <FaTags /> },
      { title: "Product SKU", path: "/productSKU", icon: <FaList /> },
      { title: "Inventory", path: "/inventory", icon: <FaWarehouse /> },
      { title: "Inventory List", path: "/inventoryList", icon: <FaList /> },
      { title: "Inventory Category", path: "/inventoryCategory", icon: <FaTags /> },
      { title: "Create Order", path: "/createOrder", icon: <FaPlusCircle /> },
      { title: "Orders Unit", path: "/ordersUnit", icon: <FaTruck /> },
      { title: "Orders Status", path: "/ordersStatus", icon: <FaClipboardCheck /> },
      { title: "Production Stage", path: "/productionStage", icon: <FaChartBar /> },
      { title: "Stage Viewer", path: "/productionStageViewer", icon: <FaEye /> },
      { title: "Stage Unit", path: "/productionStageUnit", icon: <FaCubes /> },
      { title: "Stage Type", path: "/productionStageType", icon: <FaLayerGroup /> },
      { title: "Create Unit", path: "/createUnit", icon: <FaPlusCircle /> },
      { title: "Unit List", path: "/unitList", icon: <FaList /> },
      { title: "User List", path: "/admin/userlist", icon: <FaUserCog /> },
      { title: "Create Product", path: "/createProduct", icon: <FaPlusCircle /> },
      { title: "Order List", path: "/orderList", icon: <FaShoppingCart /> },
      { title: "Production Stage List", path: "/productionStageList", icon: <FaList /> },
      { title: "Notifications", path: "/notification", icon: <FaBell /> },
      { title: "Notification List", path: "/notificationList", icon: <FaList /> },
    ],

    client: [
      { title: "Product List", path: "/productList", icon: <FaBox /> },
      { title: "Product Category", path: "/productCategory", icon: <FaTags /> },
      { title: "Product SKU", path: "/productSKU", icon: <FaList /> },
      { title: "Inventory", path: "/inventory", icon: <FaWarehouse /> },
      { title: "Inventory List", path: "/inventoryList", icon: <FaList /> },
      { title: "Inventory Category", path: "/inventoryCategory", icon: <FaTags /> },
      { title: "Create Order", path: "/createOrder", icon: <FaPlusCircle /> },
      { title: "Orders Unit", path: "/ordersUnit", icon: <FaTruck /> },
      { title: "Orders Status", path: "/ordersStatus", icon: <FaClipboardCheck /> },
      { title: "Production Stage", path: "/productionStage", icon: <FaChartBar /> },
      { title: "Stage Viewer", path: "/productionStageViewer", icon: <FaEye /> },
      { title: "Stage Unit", path: "/productionStageUnit", icon: <FaCubes /> },
      { title: "Stage Type", path: "/productionStageType", icon: <FaLayerGroup /> },
      { title: "Create Unit", path: "/createUnit", icon: <FaPlusCircle /> },
      { title: "Unit List", path: "/unitList", icon: <FaList /> },
      // { title: "Unit Inventory List", path: "/unitInventoryList", icon: <FaWarehouse /> },
      { title: "My Notifications", path: "/myNotifications", icon: <FaBell /> },
      { title: "My Orders", path: "/orderClient", icon: <FaShoppingCart /> },
    ],

    "Unit Manager": [
      { title: "Product List", path: "/productList", icon: <FaBox /> },
      { title: "Product Category", path: "/productCategory", icon: <FaTags /> },
      { title: "Product SKU", path: "/productSKU", icon: <FaList /> },
      { title: "Inventory", path: "/inventory", icon: <FaWarehouse /> },
      { title: "Inventory List", path: "/inventoryList", icon: <FaList /> },
      { title: "Inventory Category", path: "/inventoryCategory", icon: <FaTags /> },
      { title: "Create Order", path: "/createOrder", icon: <FaPlusCircle /> },
      { title: "Orders Unit", path: "/ordersUnit", icon: <FaTruck /> },
      { title: "Orders Status", path: "/ordersStatus", icon: <FaClipboardCheck /> },
      { title: "Production Stage", path: "/productionStage", icon: <FaChartBar /> },
      { title: "Stage Viewer", path: "/productionStageViewer", icon: <FaEye /> },
      { title: "Stage Unit", path: "/productionStageUnit", icon: <FaCubes /> },
      { title: "Stage Type", path: "/productionStageType", icon: <FaLayerGroup /> },
      // { title: "Unit Inventory List", path: "/unitInventoryList", icon: <FaWarehouse /> },
      { title: "My Notifications", path: "/myNotifications", icon: <FaBell /> },
    ],
  };

  const selectedNavigation = roleNavigation[role] || [];

  const gradientColors = [
    "#ff9966, #ff5e62",
    "#36D1DC, #5B86E5",
    "#667db6, #0082c8",
    "#fc5c7d, #6a82fb",
    "#ff758c, #ff7eb3",
    "#43e97b, #38f9d7",
    "#c471f5, #fa71cd",
    "#f7971e, #ffd200",
  ];

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const GradientCard = ({ item, index }) => (
    <Card
      className="option-card text-center p-3 shadow-sm"
      style={{
        border: "none",
        color: "white",
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${gradientColors[index % gradientColors.length]})`,
        cursor: "pointer",
        transition: "0.2s",
      }}
      onClick={() => navigate(item.path)}
    >
      <div style={{ fontSize: "1.8rem" }}>{item.icon}</div>
      <h6 className="mt-2 fw-bold">{item.title}</h6>
    </Card>
  );

  return (
    <Container className="py-4">
      {/* Logo */}
      <div className="text-center mb-4">
        <img src={Nutrition} alt="Logo" style={{ maxWidth: "160px" }} />
      </div>

      {/* Welcome */}
      <h4 className="text-center fw-bold text-primary mb-4">
        Welcome, {role?.toUpperCase()}
      </h4>

      {/* Navigation Cards */}
      <Row className="g-3">
        {selectedNavigation.map((item, index) => (
          <Col key={index} xs={6} sm={4} md={3} lg={3}>
            <GradientCard item={item} index={index} />
          </Col>
        ))}

        {/* Logout always visible */}
        <Col xs={6} sm={4} md={3} lg={3}>
          <Card
            className="option-card text-center p-3 shadow-sm"
            style={{
              border: "none",
              color: "white",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #434343, #000000)",
              cursor: "pointer",
            }}
            onClick={logoutHandler}
          >
            <FaSignOutAlt size={28} />
            <h6 className="mt-2 fw-bold">Logout</h6>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
