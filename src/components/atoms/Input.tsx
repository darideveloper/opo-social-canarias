import clsx from "clsx";

export type InputProps = {
  id?: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "number";
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  required?: boolean;
};

export default function Input({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  className,
  inputClassName,
  disabled = false,
  required = false,
}: InputProps) {
  const inputId = id ?? name;

  return (
    <div className={clsx("form-control w-full", className)}>
      {label && (
        <label htmlFor={inputId} className="label">
          <span className={clsx("label-text", "text-sm")}>{label}</span>
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={clsx(
          "input input-bordered w-full",
          error && "input-error",
          inputClassName
        )}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
      {error && (
        <p className="label">
          <span className={clsx("label-text-alt", "text-error", "text-wrap")} >{error}</span>
        </p>
      )}
    </div>
  );
}


