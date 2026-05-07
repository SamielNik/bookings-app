import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    event_date: "",
    event_location: "",
    event_type: "",
    package_name: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  const packages = [
    "Balloon Arch",
    "Balloon Garland",
    "Backdrop Setup",
    "Baby Shower Package",
    "Birthday Package",
    "Custom Event Decor",
  ];

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:5001/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:5001/bookings", formData);

      setMessage("Booking request submitted successfully!");
      fetchBookings();

      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        event_date: "",
        event_location: "",
        event_type: "",
        package_name: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5001/bookings/${id}/status`, {
      status,
    });
    fetchBookings();
  };

  return (
    <div className="app">
      <section className="hero">
        <h1>Bookings App</h1>
        <p>Plan beautiful event decor with a simple booking request.</p>
      </section>

      {/* BOOKING FORM */}
      <section className="booking-section">
        <h2>Request a Booking</h2>

        <form onSubmit={handleSubmit} className="booking-form">
          <input name="customer_name" placeholder="Full Name" value={formData.customer_name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          <input name="event_date" type="date" value={formData.event_date} onChange={handleChange} required />
          <input name="event_location" placeholder="Event Location" value={formData.event_location} onChange={handleChange} required />
          <input name="event_type" placeholder="Event Type" value={formData.event_type} onChange={handleChange} />

          <select name="package_name" value={formData.package_name} onChange={handleChange} required>
            <option value="">Select Package</option>
            {packages.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />

          <button type="submit">Submit Booking</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      {/* ADMIN DASHBOARD */}
      <section className="packages">
        <h2>Admin Dashboard</h2>

        {bookings.map((booking) => (
          <div key={booking.id} className="package-card">
            <h3>{booking.customer_name}</h3>
            <p>{booking.package_name}</p>
            <p>{booking.event_date}</p>
            <p>Status: {booking.status}</p>

            <div className="actions">
              <button onClick={() => updateStatus(booking.id, "Approved")}>Approve</button>
              <button onClick={() => updateStatus(booking.id, "Completed")}>Complete</button>
              <button onClick={() => updateStatus(booking.id, "Cancelled")}>Cancel</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;