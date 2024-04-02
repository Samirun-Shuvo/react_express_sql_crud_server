require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB_HOST=localhost 
// DB_NAME=react_express_sql_crud
// DB_USER=samirunshuvo
// DB_PASSWORD=shuvo01676667145

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

// Routes Example: Get all users
app.get("/api/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Routes Example: add a user
app.post("/api/user", (req, res) => {
  const { name, email } = req.body;

  // Use a parameterized query to insert the new user's data safely
  pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({
        message: "User added successfully",
        userId: results.insertId,
        status: "success",
      });
    }
  );
});

// Routes Example: Get a user
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  pool.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Routes Example: update a user
app.put("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "User not found or no update required" });
      } else {
        res.json({ message: "User updated successfully", status: "success" });
      }
    }
  );
});

// Routes Example: delete a user
app.delete("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  pool.query("DELETE FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully", status: "success" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
