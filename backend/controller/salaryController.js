const pool = require("../config/db");
const { validateSalaryPayload } = require("../middleware/validation");

const createSalaryEntry = async (req, res) => {
  const errors = validateSalaryPayload(req.body);
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });

  try {
    const { employee_id, month_year, amount, notes } = req.body;

    const [employeeRows] = await pool.query("SELECT id FROM employees WHERE id = ?", [employee_id]);
    if (!employeeRows.length) {
      return res.status(404).json({ message: "Employee does not exist." });
    }

    const [result] = await pool.query(
      "INSERT INTO salary_entries (employee_id, month_year, amount, notes) VALUES (?, ?, ?, ?)",
      [employee_id, month_year, amount, notes || null]
    );

    return res.status(201).json({ message: "Salary entry created successfully.", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create salary entry.", error: error.message });
  }
};

module.exports = {
  createSalaryEntry
};
