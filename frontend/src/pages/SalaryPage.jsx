import SalaryForm from "../components/SalaryForm";

function SalaryPage() {
  return (
    <div className="max-w-[48rem] space-y-[1.5rem] sm:space-y-[2rem]">
      <div className="flex flex-col gap-[0.25rem]">
        <h2 className="text-[1.75rem] sm:text-[2rem] font-extrabold text-slate-900 leading-tight">Payroll Management</h2>
        <p className="text-[0.875rem] text-slate-500">Generate monthly salary records and manage worker compensation.</p>
      </div>
      <SalaryForm />
    </div>
  );
}

export default SalaryPage;
