import { useState } from "react";
import clsx from "clsx";
import Input from "../../ui/Input";
import ButtonAction from "../../ui/ButtonAction";
import H1 from "../../ui/H1";
import ImageUpload from "../../ui/ImageUpload";

type RegistrationProps = {
  onSubmit?: (payload: {
    name: string;
    email: string;
    profileImage: File | null;
    password: string;
  }) => void;
  className?: string;
};

export default function Registration({ onSubmit, className }: RegistrationProps) {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    profileImage?: string;
    password?: string;
    passwordValidation?: string;
  }>({});

  // Functions
  function validate() {
    const next: {
      name?: string;
      email?: string;
      profileImage?: string;
      password?: string;
      passwordValidation?: string;
    } = {};

    if (!name) next.name = "El nombre es obligatorio";
    if (!email) next.email = "El email es obligatorio";
    if (!password) next.password = "La contraseña es obligatoria";
    if (!passwordValidation) next.passwordValidation = "Debes confirmar tu contraseña";
    if (password && passwordValidation && password !== passwordValidation) {
      next.passwordValidation = "Las contraseñas no coinciden";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleImageChange(file: File | null, preview: string) {
    setProfileImage(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      onSubmit?.({ name, email, profileImage, password });
      // Simulate request
      await new Promise((r) => setTimeout(r, 600));

      console.log("submit", { name, email, profileImage, password });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        "w-full",
        "max-w-sm",
        "mx-auto",
        "bg-base-100",
        "shadow-md",
        className
      )}
    >
      <div className={clsx("card", "bg-base-100", "shadow-md")}>
        <div className={clsx("card-body", "gap-3")}>
          {/* Header */}
          <div className={clsx("text-center", "mb-1")}>
            <H1 className="!text-xl">Registro</H1>
            <p className={clsx("text-sm", "opacity-70")}>Crea tu cuenta.</p>
          </div>

          {/* Name input */}
          <Input
            name="name"
            type="text"
            label="name (Nombre)"
            placeholder="Nombre"
            value={name}
            onChange={setName}
            error={errors.name}
            autoComplete="name"
            required
          />

          {/* Email input */}
          <Input
            name="email"
            type="email"
            label="email (Correo electrónico)"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete="email"
            required
          />

          {/* Password input */}
          <Input
            name="password"
            type="password"
            label="password (Contraseña)"
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="new-password"
            required
          />

          {/* Password validation input */}
          <Input
            name="passwordValidation"
            type="password"
            label="password validation (Confirma tu contraseña)"
            placeholder="Confirma tu contraseña"
            value={passwordValidation}
            onChange={setPasswordValidation}
            error={errors.passwordValidation}
            autoComplete="new-password"
            required
          />

          {/* Profile Image input */}
          <ImageUpload
            name="profileImage"
            label="profile image (Imagen de perfil)"
            defaultPreview="/user.svg"
            onChange={handleImageChange}
            error={errors.profileImage}
          />

          {/* Button */}
          <div className={clsx("card-actions", "mt-2", "w-full")}>
            <ButtonAction
              type="submit"
              onClick={handleSubmit}
              isSoft
              className={clsx("w-full")}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </ButtonAction>
          </div>

          <p className={clsx("text-center", "text-sm", "mt-1")}>
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className={clsx("link", "link-hover")}>
              Inicia Sesión
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

