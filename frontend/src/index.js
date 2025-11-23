import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";
import { Provider, useSelector } from "react-redux";
import store from "./store";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import Unauthorized from "./screens/Unauthorized";

import ProductCreateScreen from "./screens/admin/ProductCreateScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import CategorySelectionScreen from "./screens/CategorySelectionScreen";
import ProductCategoryScreen from "./screens/ProductCategoryScreen";
import ProductBySKUScreen from "./screens/ProductBySKUScreen";

import CreateUnitForm from "./screens/CreateUnitForm";
import UnitListScreen from "./screens/UnitListScreen";
import UnitDetailsScreen from "./screens/UnitDetailsScreen";
import UnitEditScreen from "./screens/UnitEditScreen";

import InventoryForm from "./screens/InventoryForm";
import InventoryList from "./screens/InventoryList";
import InventoryDetails from "./screens/InventoryDetails";
import InventoryEdit from "./screens/InventoryEdit";
import InventoryCategoryList from "./screens/InventoryCategoryList";
import InventoryByCategory from "./screens/InventoryByCategory";
import UnitInventoryList from "./screens/UnitInventoryList";

import CreateOrderScreen from "./screens/CreateOrderScreen";
import OrderDetails from "./screens/OrderDetails";
import OrderEdit from "./screens/OrderEdit";
import OrdersByClient from "./screens/OrdersByClient";
import OrdersByUnit from "./screens/OrdersByUnit";
import OrdersByStatus from "./screens/OrdersByStatus";

import CreateProductionStageForm from "./screens/CreateProductionStageForm";
import ProductionStageDetails from "./screens/ProductionStageDetails";
import EditProductionStage from "./screens/EditProductionStage";
import ProductionStagesViewer from "./screens/ProductionStagesViewer";
import ProductionStagesByUnit from "./screens/ProductionStagesByUnit";
import ProductionStagesByType from "./screens/ProductionStagesByType";


// Admin Screens
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import OrdersList from "./screens/admin/OrdersList";
import ProductionStageList from "./screens/admin/ProductionStageList";
import NotificationCreateForm from "./screens/admin/NotificationCreateForm";
import NotificationList from "./screens/admin/NotificationList";

// Role-based Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import MyNotifications from "./screens/MyNotifications";

// Example placeholder components for role dashboards

// Route wrapper component to use Redux state
const RouterWrapper = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        {/* Public Routes */}
        <Route index path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* For All roles with conditional - For Products*/}
        
        <Route
          path="/productList"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductListScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductDetailsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productCategory"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <CategorySelectionScreen />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/productCategory/:category"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductCategoryScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productSKU"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductBySKUScreen />
            </ProtectedRoute>
          }
        />
        {/* For All roles with conditional - For Inventory*/}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryForm />
            </ProtectedRoute>
          }
        />
       <Route
          path="/inventoryList"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryList/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/view/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/edit/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventoryCategory"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryCategoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventoryCategory/:category"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <InventoryByCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createOrder"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <CreateOrderScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/edit"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <OrderEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordersUnit"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <OrdersByUnit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordersStatus"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <OrdersByStatus />
            </ProtectedRoute>
          }
        />
         <Route
          path="/productionStage"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <CreateProductionStageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productionStage/view/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductionStageDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productionStage/edit/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <EditProductionStage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productionStageViewer"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductionStagesViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productionStageUnit"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductionStagesByUnit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productionStageType"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin", "Unit Manager"]}>
              <ProductionStagesByType />
            </ProtectedRoute>
          }
        />

        {/* Client and Admin Routes*/}

       <Route
          path="/createUnit"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin"]}>
              <CreateUnitForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unitList"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin"]}>
              <UnitListScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/units/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin"]}>
              <UnitDetailsScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/units/edit/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client", "admin"]}>
              <UnitEditScreen />
            </ProtectedRoute>
          }
        />
        

        {/* Admin Routes */}
        <Route
          path="/admin/userlist"
          element={
            <AdminRoute user={userInfo}>
              <UserListScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/:id/edit"
          element={
            <AdminRoute user={userInfo}>
              <UserEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/createProduct"
          element={
            <AdminRoute user={userInfo}>
              <ProductCreateScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/product/:id/edit"
          element={
            <AdminRoute user={userInfo}>
              <ProductEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/orderList"
          element={
            <AdminRoute user={userInfo}>
              <OrdersList />
            </AdminRoute>
          }
        />
        <Route
          path="/productionStageList"
          element={
            <AdminRoute user={userInfo}>
              <ProductionStageList />
            </AdminRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <AdminRoute user={userInfo}>
              <NotificationCreateForm />
            </AdminRoute>
          }
        />
        <Route
          path="/notificationList"
          element={
            <AdminRoute user={userInfo}>
              <NotificationList/>
            </AdminRoute>
          }
        />
         
        {/* Client-Owner and Manager Routes */}
        <Route
          path="/unitInventoryList"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client",  "Unit Manager"]}>
              <UnitInventoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myNotifications"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["client",  "Unit Manager"]}>
              <MyNotifications />
            </ProtectedRoute>
          }
        />
        {/* Client-Owner Routes */}
        <Route
          path="/orderClient"
          element={
            <ClientRoute user={userInfo}>
              <OrdersByClient />
            </ClientRoute>
          }
        />
        
       
        {/* Profile (optional - accessible by all roles) */}
        {/* <Route path="/profile" element={<ProfileScreen />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

// Mount React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterWrapper />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
