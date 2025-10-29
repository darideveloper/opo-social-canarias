import { useState } from "react";
import { clsx } from 'clsx'

type ImageUploadProps = {
  id?: string;
  name: string;
  label?: string;
  defaultPreview?: string;
  error?: string;
  onChange?: (file: File | null, preview: string) => void;
  className?: string;
  required?: boolean;
};

export default function ImageUpload({
  id,
  name,
  label,
  defaultPreview = "/user.svg",
  error,
  onChange,
  className,
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultPreview);
  const inputId = id ?? name;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onChange?.(file, previewUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(defaultPreview);
      onChange?.(null, defaultPreview);
    }
  }

  return (
    <div className={clsx("form-control", "w-full", className)}>
      {label && (
        <label htmlFor={inputId} className={clsx("label")}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className={clsx("flex", "gap-3", "items-center")}>
        <input
          id={inputId}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={required}
          className={clsx(
            "file-input",
            "file-input-bordered",
            "w-[70%]",
            error && "file-input-error"
          )}
        />
        <div className={clsx("w-[30%]", "flex", "justify-center")}>
          <img
            src={preview}
            alt="Preview"
            className={clsx("w-20", "h-20", "rounded-full", "object-cover")}
          />
        </div>
      </div>
      {error && (
        <p className={clsx("label")}>
          <span className={clsx("label-text-alt", "text-error", "text-wrap")}>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}

