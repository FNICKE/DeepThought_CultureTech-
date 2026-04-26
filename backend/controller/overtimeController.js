const pool = require("../config/db");
const { validateOvertimePayload } = require("../middleware/validation");

const createOvertimeEntry = async (req, res) => {
  const errors = validateOvertimePayload(req.body);
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });

  try {
    const { employee_id, overtime_date, overtime_hours, reason } = req.body;

    const [employeeRows] = await pool.query("SELECT id FROM employees WHERE id = ?", [employee_id]);
    if (!employeeRows.length) {
      return res.status(404).json({ message: "Worker does not exist in the system." });
    }

    const [duplicateRows] = await pool.query(
      "SELECT id FROM overtime_entries WHERE employee_id = ? AND overtime_date = ?",
      [employee_id, overtime_date]
    );
    if (duplicateRows.length) {
      return res.status(409).json({ message: "Overtime already logged for this worker and date." });
    }

    const monthStart = `${overtime_date.slice(0, 7)}-01`;
    const [monthlyRows] = await pool.query(
      `SELECT COALESCE(SUM(overtime_hours), 0) AS monthly_hours
       FROM overtime_entries
       WHERE employee_id = ?
       AND overtime_date >= ?
       AND overtime_date < DATE_ADD(?, INTERVAL 1 MONTH)`,
      [employee_id, monthStart, monthStart]
    );

    const currentMonthlyHours = Number(monthlyRows[0].monthly_hours || 0);
    const newTotal = currentMonthlyHours + Number(overtime_hours);
    if (newTotal > 60) {
      return res.status(400).json({
        message: `Monthly overtime limit exceeded. Current: ${currentMonthlyHours}h, attempted total: ${newTotal}h, allowed: 60h.`
      });
    }

    const [result] = await pool.query(
      `INSERT INTO overtime_entries (employee_id, overtime_date, overtime_hours, reason, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [employee_id, overtime_date, overtime_hours, reason]
    );

    return res.status(201).json({ message: "Overtime entry submitted successfully.", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create overtime entry.", error: error.message });
  }
};

const getOvertimeEntries = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, e.full_name, e.designation
       FROM overtime_entries o
       INNER JOIN employees e ON e.id = o.employee_id
       ORDER BY o.overtime_date DESC, o.id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch overtime entries.", error: error.message });
  }
};

const updateOvertimeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, overtime_date, overtime_hours, reason, status } = req.body;

    console.log("DEBUG: Updating Overtime Entry", { id, employee_id, status });

    if (!employee_id || !overtime_hours || !reason) {
       return res.status(400).json({ message: "Required fields are missing." });
    }

    const [result] = await pool.query(
      `UPDATE overtime_entries 
       SET employee_id=?, overtime_date=?, overtime_hours=?, reason=?, status=?
       WHERE id=?`,
      [employee_id, overtime_date, overtime_hours, reason, status || 'pending', id]
    );

    console.log("DEBUG: DB Update Result", { affectedRows: result.affectedRows });

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Overtime entry not found." });
    }

    return res.json({ message: "Overtime entry updated successfully." });
  } catch (error) {
    console.error("DEBUG: Update Error", error);
    return res.status(500).json({ message: "Failed to update overtime entry.", error: error.message });
  }
};

const deleteOvertimeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM overtime_entries WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Overtime entry not found." });
    }

    return res.json({ message: "Overtime entry deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete overtime entry.", error: error.message });
  }
};

module.exports = {
  createOvertimeEntry,
  getOvertimeEntries,
  updateOvertimeEntry,
  deleteOvertimeEntry
};
