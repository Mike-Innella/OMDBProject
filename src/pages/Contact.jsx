// (directory path: /src/pages/Contact.jsx)
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../Styling/Pages.css";

// Contact
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add doc to firestore
      await addDoc(collection(db, "contactMessage"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: serverTimestamp(),
      });

      setSubmitStatus({
        success: true,
        message:
          "Your message has been sent successfully! We will get back to you soon.",
      });

      // Clear success message timeout 5s
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

      // Clear form after successful submission (optional, but usually expected)
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: `Failed to send message: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-page__header">
        <h1>Contact Us</h1>
      </div>

      <section className="contact-page__section">
        <div className="contact-page__content">
          <div className="contact-page__info">
            <h2>Get In Touch</h2>
            <p>
              Have questions, suggestion, or feedback? We'd love to hear from
              you! Fill out the form below and our team will get back to you as
              soon as possible.
            </p>

            <div className="contact-page__method">
              <h3>Phone</h3>
              <p>555 123 4567</p>
            </div>

            <div className="contact-page__method">
              <h3>Address</h3>
              <p>
                123 Movie Lane
                <br />
                Hollywood, CA
                <br />
                90210
              </p>
            </div>

            <div className="contact-page__method">
              <h3>Hourly</h3>
              <p>
                Monday - Friday: 9am - 5pm
                <br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>

          <div className="contact-page__form-container">
            <h2>Send Us a Message</h2>

            {submitStatus && (
              <div
                className={`contact-page__submit-status ${
                  submitStatus.success
                    ? "contact-page__submit-status--success"
                    : "contact-page__submit-status--error"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form className="contact-page__form" onSubmit={handleSubmit}>
              <div className="contact-page__form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="contact-page__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="contact-page__form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-page__submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
