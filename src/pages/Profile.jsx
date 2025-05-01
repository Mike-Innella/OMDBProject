// (directory path: /src/pages/Profile.jsx)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../Styling/Pages.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [updateForm, setUpdateForm] = useState({
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateStatus, setUpdateStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUpdateForm((prev) => ({
          ...prev,
          displayName: user.displayName || "",
          email: user.email || "",
        }));
        fetchOrderHistory(user.uid);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchOrderHistory = async (userId) => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("user", "==", userId)
      );
      const querySnapshot = await getDocs(ordersQuery);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrderHistory(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateStatus(null);

    try {
      if (updateForm.displayName !== user.displayName) {
        await updateProfile(user, { displayName: updateForm.displayName });
      }

      if (updateForm.email !== user.email && updateForm.currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          updateForm.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, updateForm.email);
      }

      if (updateForm.newPassword && updateForm.currentPassword) {
        if (updateForm.newPassword !== updateForm.confirmPassword) {
          throw new Error("New passwords do not match");
        }
        const credential = EmailAuthProvider.credential(
          user.email,
          updateForm.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, updateForm.newPassword);

        setUpdateForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      setUpdateStatus({
        success: true,
        message: "Profile updated successfully",
      });

      setUser(auth.currentUser);
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.code === "auth/wrong-password") {
        setUpdateStatus({
          success: false,
          message: "Current password is incorrect",
        });
      } else if (error.code === "auth/requires-recent-login") {
        setUpdateStatus({
          success: false,
          message: "Please log out and log back in to make these changes",
        });
      } else if (error.message === "New passwords do not match") {
        setUpdateStatus({ success: false, message: error.message });
      } else {
        setUpdateStatus({
          success: false,
          message: `Update failed: ${error.message}`,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <section className="profile-section">
        <div className="profile-container">
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="profile-content">
            {activeTab === "profile" ? (
              <div className="profile-info">
                <h2>Account Information</h2>

                {updateStatus && (
                  <div
                    className={`update-status ${
                      updateStatus.success ? "success" : "error"
                    }`}
                  >
                    {updateStatus.message}
                  </div>
                )}

                <form className="profile-form" onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label htmlFor="displayName">Name</label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={updateForm.displayName}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={updateForm.email}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                  </div>

                  <h3>Change Password</h3>

                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={updateForm.currentPassword}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                    <small>Required to change email or password</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={updateForm.newPassword}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={updateForm.confirmPassword}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                  </div>

                  <button
                    type="submit"
                    className="update-btn"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="order-history">
                <h2>Order History</h2>

                {orderHistory.length === 0 ? (
                  <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button
                      className="shop-now-btn"
                      onClick={() => navigate("/")}
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orderHistory.map((order) => (
                      <div className="order-item" key={order.id}>
                        <div className="order-header">
                          <div className="order-info">
                            <span className="order-id">
                              Order #{order.id.substring(0, 8)}
                            </span>
                            <span className="order-date">
                              {order.timestamp
                                ? new Date(
                                    order.timestamp.toDate()
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </span>
                          </div>
                          <div className="order-total">
                            Total: ${order.total.toFixed(2)}
                          </div>
                        </div>

                        <div className="order-items">
                          {order.items.map((item, i) => (
                            <div className="order-product" key={i}>
                              <div className="product-info">
                                <h4>{item.title}</h4>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <div className="product-price">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="order-status">
                          Status:{" "}
                          <span
                            className={`status-${
                              order.status?.toLowerCase() || "unknown"
                            }`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
