import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bookings App API is running");
});

app.get("/test-db", async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Database connection error");
    }
  });

  app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;
  
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: true,
        message: "Login successful",
      });
    }
  
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/bookings", async (req, res) => {
    try {
      const {
        customer_name,
        email,
        phone,
        event_date,
        event_location,
        event_type,
        package_name,
        notes,
      } = req.body;
  
      const result = await pool.query(
        `INSERT INTO bookings 
        (customer_name, email, phone, event_date, event_location, event_type, package_name, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
          customer_name,
          email,
          phone,
          event_date,
          event_location,
          event_type,
          package_name,
          notes,
        ]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating booking");
    }
  });

  app.get("/bookings", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM bookings ORDER BY created_at DESC"
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting bookings");
    }
  });

  app.put("/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const result = await pool.query(
        "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send("Booking not found");
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating booking status");
    }
  });