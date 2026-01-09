import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Navbar from "./features/navbar/Navbar";
import Alert from "./features/alert/Alert";
import Drawer from "./features/drawer/Drawer";
import { useGetCurrentUserQuery } from "./app/store/api/authApi";
import Modal from "./features/modal/Modal";
import Footer from "./features/footer/Footer";
import Loader from "./features/loader/Loader";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Order from "./pages/order/Order";
import Checkout from "./pages/checkout/Checkout";
import OrderComplete from "./pages/orderComplete/OrderComplete";
import AdminBar from "./features/adminBar/AdminBar";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
const App: React.FC = () => {
  const location = useLocation();
  const { data: activeUser, isLoading } = useGetCurrentUserQuery();

  const canOpen = activeUser?.type === "editor" || activeUser?.type === "admin";

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-neutral-contrast flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-neutral-contrast font-secondary relative">
      <AdminBar enabled={canOpen} />
      {!location.pathname.startsWith('/admin') && (
        <Navbar />
      )}
      <div className="minus-nav">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />{" "}
            {/* new routes inserted here */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/order-complete/:id" element={<OrderComplete />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AnimatePresence>
        <Alert />
        <Drawer />
        <Modal />
        <Footer />
      </div>
    </div>
  );
};

export default App;
