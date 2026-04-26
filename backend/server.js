require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`DB Is Connected `);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
