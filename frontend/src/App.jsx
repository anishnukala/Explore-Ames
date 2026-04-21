import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// public pages
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Faq from "./pages/Faq.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import Payment from "./pages/Payment.jsx";
import Authors from "./pages/Authors.jsx";

// user pages
import Explore from "./pages/Explore.jsx";
import Diners from "./pages/Diners.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import DinersForm from "./pages/DinersForm.jsx";
import ExploreForm from "./pages/ExploreForm.jsx";


// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUserForm from "./pages/admin/AdminUserForm.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminDiners from "./pages/admin/AdminDiners.jsx";
import AdminExplore from "./pages/admin/AdminExplore.jsx";
import AdminFaq from "./pages/admin/AdminFaq.jsx";
import AdminShop from "./pages/admin/AdminShop.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment" element={<Payment />} />

        {/* User pages (view pages are public; forms require login) */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/diners" element={<Diners />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/diners-form"
          element={
            <ProtectedRoute>
              <DinersForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore-form"
          element={
            <ProtectedRoute>
              <ExploreForm />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-form"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/diners"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDiners />
            </ProtectedRoute>
          }
        />

        <Route
            path="/admin/explore"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminExplore />
              </ProtectedRoute>
            }
          />

          <Route
  path="/admin/faq"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminFaq />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/shop"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminShop />
    </ProtectedRoute>
  }
/>

<Route path="/authors" element={<Authors />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;