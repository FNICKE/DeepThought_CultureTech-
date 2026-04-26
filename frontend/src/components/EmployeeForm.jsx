import { useEffect, useState } from "react";
import { api } from "../api";
import { UserPlus, Mail, Phone, Building2, Briefcase, IndianRupee, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

const initialState = {
  employee_code: "",
  full_name: "",
  email: "",
  phone: "",
  department: "",
  designation: "Helper",
  basic_salary: ""
};

const designationOptions = ["Mason", "Electrician", "Plumber", "Supervisor", "Helper"];

function EmployeeForm({ onCreated, editData, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync form with editData when editing
  useEffect(() => {
    if (editData) {
      setForm({
        employee_code: editData.employee_code || "",
        full_name: editData.full_name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        department: editData.department || "",
        designation: editData.designation || "Helper",
        basic_salary: editData.basic_salary || ""
      });
      setMessage("");
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (Number(form.basic_salary) <= 0) {
      setIsError(true);
      setMessage("Basic salary must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      if (editData) {
        // Update existing employee
        await api.updateEmployee(editData.id, {
          ...form,
          basic_salary: Number(form.basic_salary)
        });
        setMessage("Employee profile updated successfully.");
      } else {
        // Create new employee
        await api.createEmployee({
          ...form,
          basic_salary: Number(form.basic_salary)
        });
        setMessage("Employee created successfully.");
      }
      
      if (!editData) setForm(initialState);
      if (onCreated) onCreated();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card-main transition-all duration-300 ${editData ? "ring-2 ring-indigo-500 shadow-xl" : ""}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${editData ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
             <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{editData ? "Edit Employee" : "Add New Employee"}</h3>
            <p className="text-sm text-slate-500">
              {editData ? `Updating ${editData.full_name}'s profile.` : "Register a new worker in the system."}
            </p>
          </div>
        </div>
        {editData && (
          <button 
            onClick={onCancelEdit}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            title="Cancel Edit"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Employee Code</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="employee_code"
                value={form.employee_code}
                onChange={handleChange}
                placeholder="EMP-001"
              />
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Department</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Construction"
                required
              />
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Designation</label>
            <select
              className="input-field appearance-none bg-no-repeat"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              name="designation"
              value={form.designation}
              onChange={handleChange}
              required
            >
              {designationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Basic Monthly Salary</label>
            <div className="relative">
              <input
                className="input-field pl-10 font-mono"
                name="basic_salary"
                type="number"
                min="1"
                value={form.basic_salary}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 btn-primary ${editData ? "bg-amber-600 hover:bg-amber-700" : ""}`}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Processing...</>
              ) : (
                editData ? "Update Profile" : "Register Employee"
              )}
            </button>
            {editData && (
              <button 
                type="button"
                onClick={onCancelEdit}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
              {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
