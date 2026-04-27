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
      "INSERT INTO salaries (employee_id, month_year, amount, notes) VALUES (?, ?, ?, ?)",
      [employee_id, month_year, amount, notes || null]
    );

    return res.status(201).json({ message: "Salary entry created successfully.", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create salary entry.", error: error.message });
  }
};

const getSalaryEntries = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, e.full_name, e.designation, e.department
       FROM salaries s
       INNER JOIN employees e ON e.id = s.employee_id
       ORDER BY s.month_year DESC, s.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch salary entries.", error: error.message });
  }
};

const updateSalaryEntry = async (req, res) => {
  const errors = validateSalaryPayload(req.body);
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });

  try {
    const { id } = req.params;
    const { employee_id, month_year, amount, notes } = req.body;

    const [result] = await pool.query(
      `UPDATE salaries 
       SET employee_id=?, month_year=?, amount=?, notes=?
       WHERE id=?`,
      [employee_id, month_year, amount, notes || null, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Salary record not found." });
    }

    return res.json({ message: "Salary record updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update salary entry.", error: error.message });
  }
};

const deleteSalaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM salaries WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Salary record not found." });
    }

    return res.json({ message: "Salary record deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete salary entry.", error: error.message });
  }
};

module.exports = {
  createSalaryEntry,
  getSalaryEntries,
  updateSalaryEntry,
  deleteSalaryEntry
};
