// (directory path: /src/pages/Cart.jsx)
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartContext } from "../context/CartContext";
import { db } from "../firebase";
import "../Styling/Pages.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useContext(CartContext);

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  // Handle shipping form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Proceed to next checkout step
  const nextStep = () => {
    if (checkoutStep === "cart") {
      setCheckoutStep("shipping");
    } else if (checkoutStep === "shipping") {
      setCheckoutStep("payment");
    } else if (checkoutStep === "payment") {
      handlePlaceOrder();
    }
  };

  // Previous checkout step
  const prevStep = () => {
    if (checkoutStep === "shipping") {
      setCheckoutStep("cart");
    } else if (checkoutStep === "payment") {
      setCheckoutStep("shipping");
    } else if (checkoutStep === "confirmation") {
      setCheckoutStep("payment");
    }
  };

  // Validate current step before proceeding
  const validateStep = () => {
    if (checkoutStep === "cart") {
      return cartItems.length > 0;
    } else if (checkoutStep === "shipping") {
      return (
        shippingInfo.fullName.trim() &&
        shippingInfo.address.trim() &&
        shippingInfo.city.trim() &&
        shippingInfo.state.trim() &&
        shippingInfo.zipCode.trim() &&
        shippingInfo.country.trim()
      );
    } else if (checkoutStep === "payment") {
      return (
        paymentInfo.cardName.trim() &&
        paymentInfo.cardNumber.trim() &&
        paymentInfo.expiryDate.trim() &&
        paymentInfo.cvv.trim()
      );
    }
    return true;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setOrderError(null);

    try {
      const user = auth.currentUser;

      const orderData = {
        userId: user ? user.uid : "guest",
        items: cartItems.map((item) => ({
          id: item.imdbId,
          title: item.Title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
        shipping: shippingInfo,
        date: serverTimestamp(),
        status: "Processing",
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      setOrderId(docRef.id);
      setCheckoutStep("confirmation");

      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderError("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render cart items
  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return (
        <div className="cart__empty">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any movies to your cart yet.</p>
          <Link to="/" className="cart__continue-btn">
            Browse Movies
          </Link>
        </div>
      );
    }

    return (
      <div className="cart__list">
        {cartItems.map((item) => (
          <div className="cart__item" key={item.imdbId}>
            <div className="cart__item-image">
              <img
                src={
                  item.Poster !== "N/A"
                    ? item.Poster
                    : "https://via.placeholder.com/100x150?text=No+Image"
                }
                alt={item.Title}
              />
            </div>
            <div className="cart__item-details">
              <h3>{item.Title}</h3>
              <p className="cart__item-year">{item.Year}</p>
            </div>
            <div className="cart__item-quantity">
              <button
                className="cart__quantity-btn"
                onClick={() => updateQuantity(item.imdbId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="cart__quantity-btn"
                onClick={() => updateQuantity(item.imdbId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="cart__item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="cart__remove-btn"
              onClick={() => removeFromCart(item.imdbId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render shipping form
  const renderShippingForm = () => (
    <div className="cart__shipping-form">
      <h2>Shipping Information</h2>
      {/* your shipping form here */}
    </div>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <div className="cart__payment-form">
      <h2>Payment Information</h2>
      {/* your payment form here */}
    </div>
  );

  // Render current checkout step
  const renderCheckoutStep = () => {
    if (checkoutStep === "cart") return renderCartItems();
    if (checkoutStep === "shipping") return renderShippingForm();
    if (checkoutStep === "payment") return renderPaymentForm();
    if (checkoutStep === "confirmation") {
      return (
        <div className="cart__confirmation">
          <h2>Order Placed Successfully! ✅</h2>
          <p>Your order ID is: {orderId}</p>
          <Link to="/">Return to Home</Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Shopping Cart</h1>
      </div>

      {/* Checkout progress steps */}
      {checkoutStep !== "confirmation" && (
        <div className="cart__steps">
          <div
            className={`cart__step ${
              ["cart", "shipping", "payment"].includes(checkoutStep)
                ? "completed"
                : ""
            }`}
          >
            <span className="cart__step-number">1</span>
            <span className="cart__step-name">Cart</span>
          </div>
          <div className="cart__divider"></div>
          <div
            className={`cart__step ${
              ["shipping", "payment", "confirmation"].includes(checkoutStep)
                ? "completed"
                : ""
            }`}
          >
            <span className="cart__step-number">2</span>
            <span className="cart__step-name">Shipping</span>
          </div>
          <div className="cart__divider"></div>
          <div
            className={`cart__step ${
              ["payment", "confirmation"].includes(checkoutStep)
                ? "completed"
                : ""
            }`}
          >
            <span className="cart__step-number">3</span>
            <span className="cart__step-name">Payment</span>
          </div>
        </div>
      )}

      <section className="cart__section">{renderCheckoutStep()}</section>
    </div>
  );
};

export default Cart;
