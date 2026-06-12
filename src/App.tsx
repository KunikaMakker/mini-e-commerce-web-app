import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./stores/CartContext";
import { Navbar } from "./components/Navbar/Navbar";
import { CartDrawer } from "./components/CartDrawer/CartDrawer";
import { ProductListing } from "./components/ProductListing/ProductListing";
import { ProductDetail } from "./components/ProductDetail/ProductDetail";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <CartDrawer />

        <main style={{ minHeight: "calc(100vh - 4.5rem)" }}>
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
