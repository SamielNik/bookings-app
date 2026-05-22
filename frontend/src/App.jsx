import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

function App() {
  const [activePage, setActivePage] = useState("home");
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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

const [adminCredentials, setAdminCredentials] = useState({
  username: "",
  password: "",
});

const [loginMessage, setLoginMessage] = useState("");

  const packages = [
    {
      name: "Balloon Arch",
      price: "Starting at $250",
      description: "A statement balloon arch perfect for entrances, dessert tables, and photo areas.",
    },
    {
      name: "Balloon Garland",
      price: "Starting at $175",
      description: "A custom balloon garland styled around your theme and event colors.",
    },
    {
      name: "Backdrop Setup",
      price: "Starting at $300",
      description: "A styled backdrop setup for photos, dessert tables, and focal points.",
    },
    {
      name: "Baby Shower Package",
      price: "Starting at $350",
      description: "A soft, elegant setup designed for baby showers and gender reveals.",
    },
    {
      name: "Birthday Package",
      price: "Starting at $300",
      description: "A fun party setup customized for kids, adults, or milestone birthdays.",
    },
    {
      name: "Custom Event Decor",
      price: "Custom quote",
      description: "Have a unique idea? Submit your vision and we’ll create a custom quote.",
    },
  ];

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bookings`);
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMessage("");
  };

  const selectPackage = (packageName) => {
    setFormData({
      ...formData,
      package_name: packageName,
    });
    setActivePage("booking");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
  
    try {
      await axios.post(`${API_BASE_URL}/admin/login`, adminCredentials);
  
      setIsAdminLoggedIn(true);
      setActivePage("admin");
      setAdminCredentials({
        username: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setLoginMessage("Invalid username or password.");
    }
  };
  
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setActivePage("home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API_BASE_URL}/bookings`, formData);

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
      setMessage("Something went wrong. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/bookings/${id}/status`, {
        status,
      });
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <button className="brand" onClick={() => handleNavClick("home")}>
          Halo Events Connecticut
        </button>

        <div className="nav-links">
  <button
    className={activePage === "home" ? "active-nav" : ""}
    onClick={() => handleNavClick("home")}
  >
    Home
  </button>

  <button
    className={activePage === "packages" ? "active-nav" : ""}
    onClick={() => handleNavClick("packages")}
  >
    Packages
  </button>

  <button
    className={activePage === "booking" ? "active-nav" : ""}
    onClick={() => handleNavClick("booking")}
  >
    Request Booking
  </button>

  <button
  className={activePage === "admin-login" || activePage === "admin" ? "active-nav" : ""}
  onClick={() => handleNavClick(isAdminLoggedIn ? "admin" : "admin-login")}
>
  {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
</button>
</div>
      </nav>

      {activePage === "home" && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">Event Decor Booking Made Simple</p>
              <h1>Beautiful event setups without the back-and-forth.</h1>
              <p className="hero-text">
                Request balloon arches, garlands, backdrops, and custom decor in one simple form.
              </p>

              <div className="hero-actions">
                <button onClick={() => handleNavClick("booking")} className="primary-button">
                  Request a Booking
                </button>
                <button onClick={() => handleNavClick("packages")} className="secondary-button">
                  View Packages
                </button>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>How It Works</h2>

            <div className="steps-grid">
              <div className="step-card">
                <span>1</span>
                <h3>Choose a package</h3>
                <p>Select the setup that best fits your event style and budget.</p>
              </div>

              <div className="step-card">
                <span>2</span>
                <h3>Submit your details</h3>
                <p>Tell us your event date, location, theme, and inspiration.</p>
              </div>

              <div className="step-card">
                <span>3</span>
                <h3>Get confirmed</h3>
                <p>Your request is reviewed and updated from pending to approved.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {activePage === "packages" && (
        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Packages</p>
            <h2>Choose your event decor package</h2>
          </div>

          <div className="package-grid">
            {packages.map((item) => (
              <div className="package-card" key={item.name}>
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
                <p>{item.description}</p>
                <button onClick={() => selectPackage(item.name)}>Select Package</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activePage === "booking" && (
        <section className="section narrow-section">
          <div className="form-card">
            <div className="section-header">
              <p className="eyebrow">Booking Request</p>
              <h2>Tell us about your event</h2>
              <p>Submit your request and we’ll review availability and details.</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <input
                  name="customer_name"
                  placeholder="Full Name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <input
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                name="event_location"
                placeholder="Event Location"
                value={formData.event_location}
                onChange={handleChange}
                required
              />

              <div className="form-row">
                <input
                  name="event_type"
                  placeholder="Event Type, e.g. Birthday, Baby Shower"
                  value={formData.event_type}
                  onChange={handleChange}
                />

                <select
                  name="package_name"
                  value={formData.package_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((item) => (
                    <option value={item.name} key={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="notes"
                placeholder="Tell us about your theme, colors, inspiration, or special requests"
                value={formData.notes}
                onChange={handleChange}
              />

              <button type="submit" className="primary-button">
                Submit Booking Request
              </button>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </section>
      )}

{activePage === "admin-login" && (
  <section className="section narrow-section">
    <div className="form-card">
      <div className="section-header">
        <p className="eyebrow">Admin Access</p>
        <h2>Admin Login</h2>
        <p>Login to view and manage booking requests.</p>
      </div>

      <form onSubmit={handleAdminLogin} className="booking-form">
        <input
          name="username"
          placeholder="Username"
          value={adminCredentials.username}
          onChange={handleAdminChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={adminCredentials.password}
          onChange={handleAdminChange}
          required
        />

        <button type="submit" className="primary-button">
          Login
        </button>
      </form>

      {loginMessage && <p className="error-message">{loginMessage}</p>}
    </div>
  </section>
)}

    {activePage === "admin" && isAdminLoggedIn && (
          <section className="section">
          <div className="section-header admin-header">
  <div>
    <p className="eyebrow">Admin</p>
    <h2>Booking Requests</h2>
    <p>Review new requests and update their status.</p>
  </div>

  <button onClick={handleLogout} className="secondary-button">
    Logout
  </button>
</div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings yet.</p>
            </div>
          ) : (
            <div className="booking-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div>
                      <h3>{booking.customer_name}</h3>
                      <p>{booking.package_name}</p>
                    </div>

                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone || "N/A"}</p>
                    <p><strong>Date:</strong> {booking.event_date}</p>
                    <p><strong>Location:</strong> {booking.event_location}</p>
                    <p><strong>Event Type:</strong> {booking.event_type || "N/A"}</p>
                    <p><strong>Notes:</strong> {booking.notes || "No notes provided"}</p>
                  </div>

                  <div className="actions">
                    <button onClick={() => updateStatus(booking.id, "Approved")}>
                      Approve
                    </button>
                    <button onClick={() => updateStatus(booking.id, "Completed")}>
                      Complete
                    </button>
                    <button onClick={() => updateStatus(booking.id, "Cancelled")}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;