// (directory path: /src/pages/Cart.jsx)
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartContext } from "../context/CartContext";
import { db } from "../firebase";
import "../Styling/Pages.css";
import "../Styling/Cart.css"

const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  } = useContext(CartContext);

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [recentlyRemoved, setRecentlyRemoved] = useState([]);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
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
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (checkoutStep === "cart") {
      // Show guest checkout prompt if user is not logged in
      const user = auth.currentUser;
      if (!user) {
        setShowGuestPrompt(true);
      } else {
        setCheckoutStep("shipping");
      }
    }
    else if (checkoutStep === "shipping") setCheckoutStep("payment");
    else if (checkoutStep === "payment") handlePlaceOrder();
  };

  const handleGuestCheckout = () => {
    setShowGuestPrompt(false);
    setCheckoutStep("shipping");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const prevStep = () => {
    if (checkoutStep === "shipping") setCheckoutStep("cart");
    else if (checkoutStep === "payment") setCheckoutStep("shipping");
  };

  const validateStep = () => {
    if (checkoutStep === "cart") return cartItems.length > 0;
    if (checkoutStep === "shipping") {
      return (
        shippingInfo.fullName.trim() &&
        shippingInfo.address.trim() &&
        shippingInfo.city.trim() &&
        shippingInfo.state.trim() &&
        shippingInfo.zipCode.trim() &&
        shippingInfo.country.trim()
      );
    }
    if (checkoutStep === "payment") {
      return (
        paymentInfo.cardName.trim() &&
        paymentInfo.cardNumber.trim() &&
        paymentInfo.expiryDate.trim() &&
        paymentInfo.cvv.trim()
      );
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      const orderData = {
        userId: user ? user.uid : "guest",
        items: cartItems.map((item) => ({
          id: item.imdbID,
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
      clearCart();
      setCheckoutStep("confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.imdbID);
    // Add to recently removed items and ensure it's not duplicated
    setRecentlyRemoved((prev) => {
      const exists = prev.some(removed => removed.imdbID === item.imdbID);
      if (exists) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleReAddItem = (item) => {
    addToCart(item);
    setRecentlyRemoved((prev) =>
      prev.filter((removed) => removed.imdbID !== item.imdbID)
    );
  };

  const renderCartItems = () => {
    const cartContent = cartItems.length === 0 ? (
      <div className="cart__empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any movies to your cart yet.</p>
        <Link to="/" className="cart__continue-btn">
          Browse Movies
        </Link>
      </div>
    ) : (
      <div className="cart__items-container">
        {cartItems.map((item) => (
          <div className="cart__item" key={item.imdbID}>
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
                onClick={() => updateQuantity(item.imdbID, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="cart__quantity-btn"
                onClick={() => updateQuantity(item.imdbID, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="cart__item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="cart__remove-btn"
              onClick={() => handleRemoveItem(item)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );

    return (
      <div className="cart__list">
        {cartContent}
        
        {recentlyRemoved.length > 0 && (
          <div className="cart__recently-removed">
            <h3>Recently Removed</h3>
            {recentlyRemoved.map((item) => (
              <div key={item.imdbID} className="cart__removed-item">
                <span>{item.Title}</span>
                <div className="cart__removed-item-actions">
                  <button 
                    className="cart__readd-btn" 
                    onClick={() => handleReAddItem(item)}
                  >
                    Re-add
                  </button>
                  <button 
                    className="cart__remove-permanently-btn" 
                    onClick={() => setRecentlyRemoved(prev => 
                      prev.filter(removed => removed.imdbID !== item.imdbID)
                    )}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderShippingForm = () => (
    <div className="cart__shipping-form">
      <h2>Shipping Information</h2>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="zipCode"
        placeholder="Zip Code"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        onChange={handleShippingChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        onChange={handleShippingChange}
      />
    </div>
  );

  const renderPaymentForm = () => (
    <div className="cart__payment-form">
      <h2>Payment Information</h2>
      <input
        type="text"
        name="cardName"
        placeholder="Name on Card"
        onChange={handlePaymentChange}
      />
      <input
        type="text"
        name="cardNumber"
        placeholder="Card Number"
        onChange={handlePaymentChange}
      />
      <input
        type="text"
        name="expiryDate"
        placeholder="Expiry Date"
        onChange={handlePaymentChange}
      />
      <input
        type="text"
        name="cvv"
        placeholder="CVV"
        onChange={handlePaymentChange}
      />
    </div>
  );

  const renderGuestPrompt = () => (
    <div className="cart__guest-prompt-overlay">
      <div className="cart__guest-prompt">
        <h2>Checkout Options</h2>
        <p>Would you like to sign in or continue as a guest?</p>
        <div className="cart__guest-prompt-actions">
          <button 
            className="cart__guest-prompt-login" 
            onClick={handleLoginRedirect}
          >
            Sign In
          </button>
          <button 
            className="cart__guest-prompt-guest" 
            onClick={handleGuestCheckout}
          >
            Continue as Guest
          </button>
        </div>
        <button 
          className="cart__guest-prompt-close" 
          onClick={() => setShowGuestPrompt(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );

  const renderCheckoutStep = () => {
    if (checkoutStep === "cart") return renderCartItems();
    if (checkoutStep === "shipping") return renderShippingForm();
    if (checkoutStep === "payment") return renderPaymentForm();
    if (checkoutStep === "confirmation") {
      return (
        <div className="cart__confirmation">
          <h2>Order Placed Successfully! ✅</h2>
          <p>Your order ID is: {orderId}</p>
          <Link to="/" className="cart__home-link">
            Return to Home
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Shopping Cart ({getItemCount()} items)</h1>
        <button className="cart__home-btn" onClick={() => navigate("/")}>
          Back to Main Page
        </button>
      </div>

      <section className="cart__section">{renderCheckoutStep()}</section>

      {checkoutStep !== "confirmation" && (
        <div className="cart__actions">
          {checkoutStep !== "cart" && (
            <button className="cart__actions-back" onClick={prevStep}>
              ← Back
            </button>
          )}
          <button
            className="cart__actions-next"
            onClick={() => {
              if (validateStep()) {
                nextStep();
              } else {
                alert("Please fill in all required fields.");
              }
            }}
          >
            {checkoutStep === "payment" ? "Place Order" : "Next →"}
          </button>
        </div>
      )}
      
      {showGuestPrompt && renderGuestPrompt()}
    </div>
  );
};

export default Cart;
