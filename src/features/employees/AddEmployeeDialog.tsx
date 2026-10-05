import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { useEmployeeStore } from "./employee.store";
import { STATUS_OPTIONS } from "./employee.filter";
import {
  todayIso,
  validateEmployeeForm,
  type EmployeeFormErrors,
  type EmployeeFormValues,
} from "./employee.validation";

const fieldId = (name: keyof EmployeeFormValues) => `employee-${name}`;

const initialValues = (): EmployeeFormValues => ({
  name: "",
  email: "",
  department: "",
  role: "",
  salary: "",
  status: "Active",
  joiningDate: todayIso(),
});

type FieldProps = {
  name: keyof EmployeeFormValues;
  label: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
};

function Field({ name, label, error, full, children }: FieldProps) {
  return (
    <div className={`form-field${full ? " form-field--full" : ""}`}>
      <label htmlFor={fieldId(name)}>{label}</label>
      {children}
      {error && (
        <p className="form-error" id={`${fieldId(name)}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  const employees = useEmployeeStore((state) => state.employees);
  const addEmployee = useEmployeeStore((state) => state.addEmployee);

  const [values, setValues] = useState<EmployeeFormValues>(initialValues);
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department))].sort(),
    [employees],
  );

  function setField(name: keyof EmployeeFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as the user edits it
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }

  // Props shared by every control: id, name, value, onChange, and the ARIA error wiring
  const fieldProps = (name: keyof EmployeeFormValues) => ({
    id: fieldId(name),
    name,
    value: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
    onChange: (event: { target: { value: string } }) => setField(name, event.target.value),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const existingEmails = new Set(employees.map((employee) => employee.email.toLowerCase()));
    const result = validateEmployeeForm(values, existingEmails);

    if (!result.data) {
      setErrors(result.errors);
      // Move focus to the first invalid field
      const firstInvalid = Object.keys(result.errors)[0];
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    addEmployee(result.data);
    onClose();
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <div className="dialog-header">
        <h2 id="add-employee-title">Add employee</h2>
        <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="dialog-body form-grid">
        <Field name="name" label="Full name" error={errors.name} full>
          <input {...fieldProps("name")} type="text" autoComplete="off" data-autofocus />
        </Field>

        <Field name="email" label="Email" error={errors.email} full>
          <input {...fieldProps("email")} type="email" autoComplete="off" />
        </Field>

        <Field name="department" label="Department" error={errors.department}>
          <select {...fieldProps("department")}>
            <option value="">Select…</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </Field>

        <Field name="role" label="Role" error={errors.role}>
          <input {...fieldProps("role")} type="text" autoComplete="off" />
        </Field>

        <Field name="salary" label="Salary (USD)" error={errors.salary}>
          <input {...fieldProps("salary")} type="number" min={0} step={1} inputMode="numeric" />
        </Field>

        <Field name="status" label="Status" error={errors.status}>
          <select {...fieldProps("status")}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        <Field name="joiningDate" label="Joining date" error={errors.joiningDate}>
          <input {...fieldProps("joiningDate")} type="date" />
        </Field>
      </div>

      <div className="dialog-footer">
        <button type="button" className="toolbar-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          Add employee
        </button>
      </div>
    </form>
  );
}

type AddEmployeeDialogProps = {
  open: boolean;
  onClose: () => void;
};

function AddEmployeeDialog({ open, onClose }: AddEmployeeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync the native dialog with the `open` prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal(); // gives focus trapping, Esc to close, inert background, backdrop
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="add-employee-title"
      onClose={onClose} // fires on Esc as well as dialog.close()
      onClick={(event) => {
        // A click on the backdrop targets the <dialog> itself, not its content
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Mounted only while open, so the form state resets every time */}
      {open && <AddEmployeeForm onClose={onClose} />}
    </dialog>
  );
}

export default AddEmployeeDialog;