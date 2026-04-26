const pool = require("../config/db");

const init = async () => {
  try {
    console.log("Initializing database schema...");

    // Create Employees Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_code VARCHAR(50),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        department VARCHAR(100) NOT NULL,
        designation ENUM('Mason', 'Electrician', 'Plumber', 'Supervisor', 'Helper') NOT NULL,
        basic_salary DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Employees table verified.");

    // Create Overtime Entries Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS overtime_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        overtime_date DATE NOT NULL,
        overtime_hours DECIMAL(4, 2) NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `);
    console.log("Overtime entries table verified.");

    // Create Salaries Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS salaries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        month_year VARCHAR(7) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `);
    console.log("Salaries table verified.");

    console.log("Database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

init();
