const isValidDateString = (value) => {
  if (!value || Number.isNaN(Date.parse(value))) {
    return false;
  }
  return true;
};

const getDateOnly = (dateLike) => {
  const date = new Date(dateLike);
  date.setHours(0, 0, 0, 0);
  return date;
};

const validateEmployeePayload = (body) => {
  const errors = [];
  const allowedDesignations = [
    "Fullstack Developer", "Frontend Developer", "Backend Developer", 
    "UI/UX Designer", "QA Engineer", "Project Manager",
    "Mason", "Electrician", "Plumber", "Supervisor", "Helper"
  ];

  if (!body.full_name || !String(body.full_name).trim()) errors.push("Full name is required.");
  if (!body.department || !String(body.department).trim()) errors.push("Department is required.");

  const salary = Number(body.basic_salary);
  if (!Number.isFinite(salary)) errors.push("Basic salary must be a valid number.");
  if (Number.isFinite(salary) && salary <= 0) errors.push("Basic salary must be greater than 0.");

  if (!body.designation || !allowedDesignations.includes(body.designation)) {
    errors.push("Designation is required and must be a valid option.");
  }

  return errors;
};

const validateSalaryPayload = (body) => {
  const errors = [];

  if (!body.employee_id) errors.push("Employee ID is required.");
  if (!body.month_year || !/^\d{4}-\d{2}$/.test(String(body.month_year))) {
    errors.push("Month must be in YYYY-MM format.");
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount)) errors.push("Amount must be a valid number.");
  if (Number.isFinite(amount) && amount <= 0) errors.push("Amount must be greater than 0.");

  return errors;
};

const validateOvertimePayload = (body) => {
  const errors = [];

  if (!body.employee_id) errors.push("Employee ID is required.");
  if (!body.overtime_date) errors.push("Overtime date is required.");
  if (!body.reason || String(body.reason).trim().length < 10) {
    errors.push("Reason is required and must be at least 10 characters.");
  }

  const hours = Number(body.overtime_hours);
  if (!Number.isFinite(hours)) errors.push("Overtime hours must be a valid number.");
  if (Number.isFinite(hours) && (hours < 1 || hours > 6)) {
    errors.push("Overtime hours must be between 1 and 6.");
  }

  if (body.overtime_date && !isValidDateString(body.overtime_date)) {
    errors.push("Overtime date is invalid.");
  }

  if (body.overtime_date && isValidDateString(body.overtime_date)) {
    const selectedDate = getDateOnly(body.overtime_date);
    const today = getDateOnly(new Date());
    const pastLimit = getDateOnly(new Date());
    pastLimit.setDate(today.getDate() - 7);

    if (selectedDate > today) {
      errors.push("Overtime date cannot be in the future.");
    }
    if (selectedDate < pastLimit) {
      errors.push("Overtime date cannot be more than 7 days old.");
    }
  }

  return errors;
};

module.exports = {
  validateEmployeePayload,
  validateSalaryPayload,
  validateOvertimePayload
};
