require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    // Attempt a test query
    await pool.query("SELECT 1");
    console.log("Database connected successfully.");
  } catch (error) {
    console.warn("WARNING: Database connection failed. The server will start, but database operations will fail.");
    console.error("Reason:", error.message || error.code || error);
  }

  // Start the server regardless of DB status to avoid ERR_CONNECTION_REFUSED
  app.listen(PORT, () => {
    console.log(`\n-----------------------------------------`);
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`-----------------------------------------\n`);
  });
};

startServer();
