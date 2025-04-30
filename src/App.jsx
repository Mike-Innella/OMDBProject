// (directory path: /src/App.jsx)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginSignup from "./pages/LoginSignup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import AdminDashboard from "./components/AdminDashboard";
import MovieDetails from "./pages/MovieDetails";
import "./Styling/Global.css";

const isLocal = window.location.hostname === "localhost";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router basename={isLocal ? "/" : process.env.PUBLIC_URL}>
          <div className="app">
            <Header />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/movie/:imdbID" element={<MovieDetails />}></Route>
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
