import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import "../css/App.css";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // ROLE → NAVIGATION MAP
  // ---------------------------
  const navConfig = {
    admin: {
      title: "Admin Panel",
      sections: {
        Products: [
          "/productList",
          "/productCategory",
          "/productSKU",
          "/createProduct",
        ],
        Inventory: [
          "/inventory",
          "/inventoryList",
          "/inventoryCategory",
        ],
        Orders: [
          "/createOrder",
          "/ordersUnit",
          "/ordersStatus",
          "/orderList",
        ],
        Production: [
          "/productionStage",
          "/productionStageViewer",
          "/productionStageUnit",
          "/productionStageType",
          "/productionStageList",
        ],
        Units: [
          "/createUnit",
          "/unitList",
        ],
        Notifications: [
          "/notification",
          "/notificationList",
        ],
        Users: [
          "/admin/userlist",
        ],
      },
    },

    client: {
      title: "Client Menu",
      sections: {
        Products: [
          "/productList",
          "/productCategory",
          "/productSKU",
        ],
        Inventory: [
          "/inventory",
          "/inventoryList",
          "/inventoryCategory",
          // "/unitInventoryList",
        ],
        Orders: [
          "/createOrder",
          "/ordersUnit",
          "/ordersStatus",
          "/orderClient",
        ],
        Production: [
          "/productionStage",
          "/productionStageViewer",
          "/productionStageUnit",
          "/productionStageType",
        ],
        Units: [
          "/createUnit",
          "/unitList",
        ],
        Notifications: [
          "/myNotifications",
        ],
      },
    },

    "Unit Manager": {
      title: "Unit Manager",
      sections: {
        Products: [
          "/productList",
          "/productCategory",
          "/productSKU",
        ],
        Inventory: [
          "/inventory",
          "/inventoryList",
          "/inventoryCategory",
          // "/unitInventoryList",
        ],
        Orders: [
          "/createOrder",
          "/ordersUnit",
          "/ordersStatus",
        ],
        Production: [
          "/productionStage",
          "/productionStageViewer",
          "/productionStageUnit",
          "/productionStageType",
        ],
        Notifications: [
          "/myNotifications",
        ],
      },
    },
  };

  // ---------------------------
  // SECTION NAME → LABEL
  // ---------------------------
  const prettyNames = {
    "/productList": "Product List",
    "/productCategory": "Product Category",
    "/productSKU": "Product SKU",

    "/inventory": "Inventory",
    "/inventoryList": "Inventory List",
    "/inventoryCategory": "Inventory Category",

    "/createOrder": "Create Order",
    "/ordersUnit": "Orders Unit",
    "/ordersStatus": "Orders Status",
    "/orderList": "Order List",
    "/orderClient": "My Orders",

    "/productionStage": "Production Stage",
    "/productionStageViewer": "Stage Viewer",
    "/productionStageUnit": "Stage Unit",
    "/productionStageType": "Stage Type",
    "/productionStageList": "Production Stage List",

    "/createUnit": "Create Unit",
    "/unitList": "Unit List",
    "/unitInventoryList": "Unit Inventory List",

    "/notification": "Send Notification",
    "/notificationList": "Notification List",
    "/myNotifications": "My Notifications",

    "/admin/userlist": "User List",
    "/createProduct": "Create Product",
  };

  // ---------------------------
  // RENDER DROPDOWN DYNAMICALLY
  // ---------------------------
  const renderRoleBasedLinks = () => {
    if (!userInfo?.role) return null;

    const config = navConfig[userInfo.role];
    if (!config) return null;

    return (
      <NavDropdown title={config.title} id="role-menu">
        {Object.entries(config.sections).map(([sectionName, routes]) => (
          <div key={sectionName}>
            <NavDropdown.Header className="fw-bold">
              {sectionName}
            </NavDropdown.Header>

            {routes.map((route) => (
              <LinkContainer to={route} key={route}>
                <NavDropdown.Item>
                  {prettyNames[route] || route}
                </NavDropdown.Item>
              </LinkContainer>
            ))}

            <NavDropdown.Divider />
          </div>
        ))}
      </NavDropdown>
    );
  };

  return (
    <header>
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-sm py-2 border-bottom"
        sticky="top"
      >
        <Container>
          {/* Brand Logo */}
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <img
                src={logo}
                alt="App Logo"
                height="45"
                className="rounded-circle border border-2 border-success"
              />
              <span className="fw-bold fs-5 text-success">Nutritionist</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">

              {/* Home */}
              <LinkContainer to="/">
                <Nav.Link className="fw-semibold text-dark hover-link">
                  Home
                </Nav.Link>
              </LinkContainer>

              {/* Profile */}
              <LinkContainer to="/profile">
                <Nav.Link className="fw-semibold text-dark hover-link">
                  Profile
                </Nav.Link>
              </LinkContainer>

              {/* Dynamic Role Dropdown */}
              {renderRoleBasedLinks()}

              {/* User Dropdown */}
              {userInfo ? (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center gap-1">
                      <FaUser className="text-success" />
                      {userInfo.name}
                    </span>
                  }
                  id="username"
                  align="end"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="fw-semibold text-dark hover-link">
                    <FaUser className="me-1" />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
