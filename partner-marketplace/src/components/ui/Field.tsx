export function Field({
  label,
  id,
  placeholder,
  type = "text",
  required,
  defaultValue,
  min,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: string | number;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        min={min}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  placeholder,
  required,
  rows = 3,
  defaultValue,
}: {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

export function SelectField({
  label,
  id,
  options,
  required,
  defaultValue,
}: {
  label: string;
  id: string;
  options: string[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxGroupField({
  label,
  options,
  name,
  defaultChecked = [],
}: {
  label: string;
  options: string[];
  name: string;
  defaultChecked?: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-brand"
          >
            <input
              type="checkbox"
              name={name}
              value={opt}
              defaultChecked={defaultChecked.includes(opt)}
              className="accent-indigo-600"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
