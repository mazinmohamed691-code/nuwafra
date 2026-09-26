import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CustDashboard from "./pages/customer/Dashboard";
import Stores from "./pages/customer/Stores";
import StoreDetail from "./pages/customer/StoreDetail";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import TrackOrder from "./pages/customer/TrackOrder";
import Favorites from "./pages/customer/Favorites";
import Notifications from "./pages/customer/Notifications";
import Profile from "./pages/customer/Profile";
import Addresses from "./pages/customer/Addresses";
import MerchDashboard from "./pages/merchant/Dashboard";
import MerchStoreInfo from "./pages/merchant/StoreInfo";
import MerchProducts from "./pages/merchant/Products";
import MerchProductForm from "./pages/merchant/ProductForm";
import MerchOrders from "./pages/merchant/Orders";
import MerchSales from "./pages/merchant/Sales";
import MerchCommissions from "./pages/merchant/Commissions";
import MerchWallet from "./pages/merchant/Wallet";
import MerchTransactions from "./pages/merchant/Transactions";
import DrvDashboard from "./pages/driver/Dashboard";
import DrvNew from "./pages/driver/NewOrders";
import DrvAccepted from "./pages/driver/AcceptedOrders";
import DrvCurrent from "./pages/driver/CurrentOrder";
import DrvEarnings from "./pages/driver/Earnings";
import DrvCash from "./pages/driver/Cash";
import DrvHistory from "./pages/driver/History";
import AdmDashboard from "./pages/admin/Dashboard";
import AdmCustomers from "./pages/admin/Customers";
import AdmStores from "./pages/admin/Stores";
import AdmRestaurants from "./pages/admin/Restaurants";
import AdmDrivers from "./pages/admin/Drivers";
import AdmProducts from "./pages/admin/Products";
import AdmCategories from "./pages/admin/Categories";
import AdmOrders from "./pages/admin/Orders";
import AdmSales from "./pages/admin/Sales";
import AdmCommissions from "./pages/admin/Commissions";
import AdmDeliveryFees from "./pages/admin/DeliveryFees";
import AdmMerchantBalances from "./pages/admin/MerchantBalances";
import AdmDriverDues from "./pages/admin/DriverDues";
import AdmStats from "./pages/admin/Stats";
function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="stores" element={<Stores />} />
        <Route path="store/:id" element={<StoreDetail />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<RoleRedirect />} />
        <Route path="customer" element={<ProtectedRoute role="customer"><CustDashboard /></ProtectedRoute>} />
        <Route path="customer/cart" element={<Cart />} />
        <Route path="customer/checkout" element={<ProtectedRoute role="customer"><Checkout /></ProtectedRoute>} />
        <Route path="customer/orders" element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
        <Route path="customer/orders/:id" element={<ProtectedRoute role="customer"><OrderDetail /></ProtectedRoute>} />
        <Route path="customer/track/:id" element={<ProtectedRoute role="customer"><TrackOrder /></ProtectedRoute>} />
        <Route path="customer/favorites" element={<ProtectedRoute role="customer"><Favorites /></ProtectedRoute>} />
        <Route path="customer/notifications" element={<ProtectedRoute role="customer"><Notifications /></ProtectedRoute>} />
        <Route path="customer/profile" element={<ProtectedRoute role="customer"><Profile /></ProtectedRoute>} />
        <Route path="customer/addresses" element={<ProtectedRoute role="customer"><Addresses /></ProtectedRoute>} />
        <Route path="merchant" element={<ProtectedRoute role="merchant"><MerchDashboard /></ProtectedRoute>} />
        <Route path="merchant/store" element={<ProtectedRoute role="merchant"><MerchStoreInfo /></ProtectedRoute>} />
        <Route path="merchant/products" element={<ProtectedRoute role="merchant"><MerchProducts /></ProtectedRoute>} />
        <Route path="merchant/products/new" element={<ProtectedRoute role="merchant"><MerchProductForm /></ProtectedRoute>} />
        <Route path="merchant/products/:id/edit" element={<ProtectedRoute role="merchant"><MerchProductForm /></ProtectedRoute>} />
        <Route path="merchant/orders" element={<ProtectedRoute role="merchant"><MerchOrders /></ProtectedRoute>} />
        <Route path="merchant/sales" element={<ProtectedRoute role="merchant"><MerchSales /></ProtectedRoute>} />
        <Route path="merchant/commissions" element={<ProtectedRoute role="merchant"><MerchCommissions /></ProtectedRoute>} />
        <Route path="merchant/wallet" element={<ProtectedRoute role="merchant"><MerchWallet /></ProtectedRoute>} />
        <Route path="merchant/transactions" element={<ProtectedRoute role="merchant"><MerchTransactions /></ProtectedRoute>} />
        <Route path="driver" element={<ProtectedRoute role="driver"><DrvDashboard /></ProtectedRoute>} />
        <Route path="driver/new" element={<ProtectedRoute role="driver"><DrvNew /></ProtectedRoute>} />
        <Route path="driver/accepted" element={<ProtectedRoute role="driver"><DrvAccepted /></ProtectedRoute>} />
        <Route path="driver/current" element={<ProtectedRoute role="driver"><DrvCurrent /></ProtectedRoute>} />
        <Route path="driver/earnings" element={<ProtectedRoute role="driver"><DrvEarnings /></ProtectedRoute>} />
        <Route path="driver/cash" element={<ProtectedRoute role="driver"><DrvCash /></ProtectedRoute>} />
        <Route path="driver/history" element={<ProtectedRoute role="driver"><DrvHistory /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute role="admin"><AdmDashboard /></ProtectedRoute>} />
        <Route path="admin/customers" element={<ProtectedRoute role="admin"><AdmCustomers /></ProtectedRoute>} />
        <Route path="admin/stores" element={<ProtectedRoute role="admin"><AdmStores /></ProtectedRoute>} />
        <Route path="admin/restaurants" element={<ProtectedRoute role="admin"><AdmRestaurants /></ProtectedRoute>} />
        <Route path="admin/drivers" element={<ProtectedRoute role="admin"><AdmDrivers /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute role="admin"><AdmProducts /></ProtectedRoute>} />
        <Route path="admin/categories" element={<ProtectedRoute role="admin"><AdmCategories /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute role="admin"><AdmOrders /></ProtectedRoute>} />
        <Route path="admin/sales" element={<ProtectedRoute role="admin"><AdmSales /></ProtectedRoute>} />
        <Route path="admin/commissions" element={<ProtectedRoute role="admin"><AdmCommissions /></ProtectedRoute>} />
        <Route path="admin/delivery-fees" element={<ProtectedRoute role="admin"><AdmDeliveryFees /></ProtectedRoute>} />
        <Route path="admin/merchant-balances" element={<ProtectedRoute role="admin"><AdmMerchantBalances /></ProtectedRoute>} />
        <Route path="admin/driver-dues" element={<ProtectedRoute role="admin"><AdmDriverDues /></ProtectedRoute>} />
        <Route path="admin/stats" element={<ProtectedRoute role="admin"><AdmStats /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}