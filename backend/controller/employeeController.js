const pool = require("../config/db");
const { validateEmployeePayload } = require("../middleware/validation");

const getEmployees = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees ORDER BY id DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch employees.", error: error.message });
  }
};

const createEmployee = async (req, res) => {
  const errors = validateEmployeePayload(req.body);
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });

  try {
    const { employee_code, full_name, email, phone, department, designation, basic_salary } = req.body;

    const [result] = await pool.query(
      `INSERT INTO employees (employee_code, full_name, email, phone, department, designation, basic_salary)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employee_code || null, full_name, email || null, phone || null, department, designation, basic_salary]
    );

    return res.status(201).json({ message: "Employee created successfully.", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create employee.", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const errors = validateEmployeePayload(req.body);
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });

  try {
    const { id } = req.params;
    const { employee_code, full_name, email, phone, department, designation, basic_salary } = req.body;

    const [result] = await pool.query(
      `UPDATE employees
       SET employee_code=?, full_name=?, email=?, phone=?, department=?, designation=?, basic_salary=?
       WHERE id=?`,
      [employee_code || null, full_name, email || null, phone || null, department, designation, basic_salary, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.json({ message: "Employee updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update employee.", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if employee has associated records (optional: could also use cascading deletes in DB)
    const [salaryRows] = await pool.query("SELECT id FROM salaries WHERE employee_id = ?", [id]);
    const [overtimeRows] = await pool.query("SELECT id FROM overtime_entries WHERE employee_id = ?", [id]);
    
    if (salaryRows.length || overtimeRows.length) {
      return res.status(400).json({ 
        message: "Cannot delete employee with existing salary or overtime records. Please delete those records first." 
      });
    }

    const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete employee.", error: error.message });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
