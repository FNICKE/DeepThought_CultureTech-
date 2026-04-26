const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const overtimeRoutes = require("./routes/overtimeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running." });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({
      ok: true,
      dbConnected: true,
      message: "Database connected successfully."
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      dbConnected: false,
      message: "Database connection failed.",
      error: error.message
    });
  }
});

app.use("/api/employees", employeeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/overtime", overtimeRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({
    message: "Unhandled server error.",
    error: err.message
  });
});

module.exports = app;
