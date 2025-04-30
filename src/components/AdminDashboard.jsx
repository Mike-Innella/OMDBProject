// (directory path: /src/components/AdminDashboard.jsx)
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { init, send } from "@emailjs/browser";
import { db } from "../firebase";
import "../Styling/AdminDashboard.css";

const AdminDashboard = () => {
  // Authentication & state variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState(null);

  const auth = getAuth();

  // Init EmailJS
  useEffect(() => {
    init("cePFoU8dvsaDA1Ayz"); // Your public EmailJS key
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      fetchMessages(); // Load messages on successful login
    } catch (error) {
      setError("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      setError("Logout failed: " + error.message);
    }
  };

  // Fetch messages from Firestore
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const messagesQuery = query(
        collection(db, "contactMessages"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(messagesQuery);

      const messagesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messagesList);
    } catch (error) {
      setError("Error fetching messages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "contactMessages", messageId));
      setMessages(messages.filter((message) => message.id !== messageId));

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      setError("Error deleting message: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Select a message to reply to
  const selectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText("");
    setReplyStatus(null);
  };

  // Send Reply Email via EmailJS
  const sendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    setReplyStatus(null);

    try {
      const templateParams = {
        to_name: selectedMessage.name,
        to_email: selectedMessage.email,
        message: replyText,
        reply_to: "admin@omdbmoviestore.com",
      };

      await send("service_gmail", "template_dfltemailtemp", templateParams);

      setReplyStatus({
        success: true,
        message: `Reply sent to ${selectedMessage.name} at ${selectedMessage.email}.`,
      });

      setReplyText("");
    } catch (error) {
      setReplyStatus({
        success: false,
        message: "Failed to send reply: " + error.message,
      });
    } finally {
      setSendingReply(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <h2 className="admin-dashboard__title">Admin Login</h2>

        {/* Error Message */}
        {error && <div className="admin-dashboard__error">{error}</div>}

        {/* Login Form */}
        <form className="admin-dashboard__login-form" onSubmit={handleLogin}>
          <div className="admin-dashboard__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="admin-dashboard__login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="admin-dashboard">
      {/* Header with Logout */}
      <div className="admin-dashboard__header">
        <h2 className="admin-dashboard__title">Admin Dashboard</h2>
        <button
          className="admin-dashboard__logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="admin-dashboard__error">{error}</div>}

      <div className="admin-dashboard__content">
        {/* Message List */}
        <div className="admin-dashboard__messages">
          <h3>Contact Messages</h3>

          {loading ? (
            <div className="admin-dashboard__loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="admin-dashboard__messages-empty">
              No messages found.
            </div>
          ) : (
            <ul className="admin-dashboard__messages-list">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`admin-dashboard__message-item ${
                    selectedMessage && selectedMessage.id === message.id
                      ? "admin-dashboard__message-item--selected"
                      : ""
                  }`}
                  onClick={() => selectMessage(message)}
                >
                  <div className="admin-dashboard__message-header">
                    <span className="admin-dashboard__message-name">
                      {message.name}
                    </span>
                    <span className="admin-dashboard__message-date">
                      {message.timestamp
                        ? new Date(message.timestamp.toDate()).toLocaleString()
                        : "Unknown date"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Message Detail + Reply Form */}
        <div className="admin-dashboard__message-detail">
          {selectedMessage ? (
            <>
              <div className="admin-dashboard__message-selected">
                <h3>Message from {selectedMessage.name}</h3>
                <div className="admin-dashboard__message-info">
                  <p>
                    <strong>Email:</strong> {selectedMessage.email}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedMessage.timestamp
                      ? new Date(
                          selectedMessage.timestamp.toDate()
                        ).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              </div>

              <div className="admin-dashboard__reply">
                <h3>Reply</h3>

                {/* Status feedback */}
                {replyStatus && (
                  <div
                    className={`admin-dashboard__reply-status ${
                      replyStatus.success
                        ? "admin-dashboard__reply-status--success"
                        : "admin-dashboard__reply-status--error"
                    }`}
                  >
                    {replyStatus.message}
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={sendReply}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    required
                  />
                  <button
                    type="submit"
                    className="admin-dashboard__reply-send-button"
                    disabled={sendingReply || !replyText.trim()}
                  >
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="admin-dashboard__message-empty">
              <p>Select a message to view details and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
